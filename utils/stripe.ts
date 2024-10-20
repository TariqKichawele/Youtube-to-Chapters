import { getServerSession } from 'next-auth';
import Stripe from 'stripe';

import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-09-30.acacia'
});

interface StripeSubscription {
    status: string;
    current_period_start: number;
    current_period_end: number;
    created: number;
}


// Check if the user has a subscription
export async function hasSubscription(): Promise<{
    isSubscribed: boolean;
    subscriptionData: StripeSubscription[];
}> {
    const session = await getServerSession(authOptions);

    if(session && session.user?.email) {
        const user = await prisma.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if(!user?.stripe_customer_id) {
            return {
                isSubscribed: false,
                subscriptionData: []
            }
        }

        const subscriptions = await stripe.subscriptions.list({
            customer: String(user.stripe_customer_id)
        });

        return {
            isSubscribed: subscriptions.data.length > 0,
            subscriptionData: subscriptions.data
        }
    }

    return {
        isSubscribed: false,
        subscriptionData: []
    }
}

// Create a checkout session
export async function createCheckoutLink(customer: string) {
    const checkout = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard`,
        customer: customer,
        line_items: [
            {
                price: process.env.PRICE_KEY,
                quantity: 1
            }
        ],
        mode: 'subscription',
    });

    return checkout.url
}


// Create a portal session
export async function generateCustomerPortalLink(customerId: string) {
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `https://billing.stripe.com/p/login/test_fZeaHU8pFcmT6bKbII?return_url=${process.env.NEXTAUTH_URL}/dashboard`
        });

        return portalSession.url
    } catch(error) {
        console.error('Failed to generate customer portal link', error);
    }
}


// Create a customer
export async function createCustomerIfNull() {
    const session = await getServerSession(authOptions);

    if(session && session.user?.email) {
        const userDB = await prisma.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if(!userDB?.stripe_customer_id) {
            const customer = await stripe.customers.create({
                email: session.user.email
            });

            await prisma.user.update({
                where: {
                    id: userDB?.id
                },
                data: {
                    stripe_customer_id: customer.id
                }
            });

            const user2 = await prisma.user.findFirst({
                where: {
                    id: userDB?.id
                }
            });

            return user2?.stripe_customer_id;
        }
    }
}

export async function checkChapterCreationEligibilty(): Promise<{
    isEligible: boolean;
    message: string;
    remainingGenerations: number;
}> {
    // Retrieve the current session
    const session = await getServerSession(authOptions);
    
    // Check if the session exists and if the user has an email
    if(!session || !session.user?.email) {
        return {
            isEligible: false,
            message: 'Authentication required',
            remainingGenerations: 0
        };
    }

    // Find the user in the database using the email from the session
    const user = await prisma.user.findFirst({
        where: {
            email: session.user.email
        }
    });

    // If the user is not found, return eligibility as false
    if(!user) {
        return {
            isEligible: false,
            message: 'User not found',
            remainingGenerations: 0
        };
    }

    // Get the user's subscription data
    const stripeSubscriptionData = await hasSubscription();

    // Get the current date
    const currentDate = new Date();

    let isSubscribed = false;
    let periodStart: number;
    let perionEnd: number;
    let subscriptionDated: number | null = null;

    // Check if the user has any subscriptions
    if(stripeSubscriptionData.subscriptionData.length > 0) {
        const subscription = stripeSubscriptionData.subscriptionData[0];
        isSubscribed = subscription.status === 'active'; // Check if the subscription is active
        periodStart = subscription.current_period_start; // Get the start of the current period
        perionEnd = subscription.current_period_end; // Get the end of the current period
        subscriptionDated = subscription.created; // Get the creation date of the subscription
    } else {
        // If no subscription, set the period to the current month
        periodStart = Math.floor(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime() / 1000);
        perionEnd = Math.floor(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getTime() / 1000);
    }

    // Count the number of chapters created by the user in the relevant time period
    const chapterGenerationCount = await prisma.chapterSet.count({
        where: {
            userId: user.id,
            createdAt: {
                gte: new Date(isSubscribed ? Math.max(periodStart, subscriptionDated!) * 1000 : periodStart * 1000),
                lt: new Date(perionEnd * 1000)
            }
        }
    });

    // Determine the limit of chapter generations based on subscription status
    const limit = isSubscribed ? 40 : 10;
    const remainingGenerations = Math.max(0, limit - chapterGenerationCount); // Calculate remaining generations

    // If no remaining generations, prepare a message for the user
    if(remainingGenerations === 0) {
        const resetDate = new Date(perionEnd * 1000).toLocaleDateString();
        return {
            isEligible: false,
            message: isSubscribed
                ? `You have reached the maximum number of chapters for this subscription period. Reset Date: ${resetDate}`
                : `You have reached the maximum number of chapter generations for the free tier. You can make more on ${resetDate}`,
            remainingGenerations: 0,
        }
    }

    // Return eligibility status and remaining generations
    return {
        isEligible: true,
        message: `
            You have ${remainingGenerations} chapter generation${ remainingGenerations !== 1 ? "s" : ""} remaining for 
            this ${isSubscribed ? "billing cycle" : "month"}
        `,
        remainingGenerations: remainingGenerations
    }
}
