import { getServerSession } from 'next-auth';
import Stripe from 'stripe';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

export async function createCheckoutLink(customer: string) {
    const checkout = await stripe.checkout.sessions.create({
        success_url: `${process.env.NEXTAUTH_URL}/dashboard&success=true`,
        cancel_url: `${process.env.NEXTAUTH_URL}/dashboard&success=false`,
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

export async function generateCustomerPortalLink(customerId: string) {
    try {
        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXTAUTH_URL}/dashboard`
        });

        return portalSession.url
    } catch(error) {
        console.error('Failed to generate customer portal link', error);
    }
}

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

