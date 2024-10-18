export interface VideoDetails {
    id: string;
    title: string;
    lengthSeconds: string;
    keywords: string[];
    channelTitle: string;
    channelId: string;
    description: string;
    thumbnail: Thumbnail[];
    allowRatings: boolean;
    viewCount: string;
    isPrivate: boolean;
    isUnpluggedCorpus: boolean;
    isLiveContent: boolean;
    isCrawlable: boolean;
    isFamilySafe: boolean;
    availableCountries: string[];
    isUnlisted: boolean;
    category: string;
    publishDate: string;
    uploadDate: string;
    subtitles: Subtitles;
    storyboards: Storyboard[];
    superTitle: string;
    likeCount: string;
    channelThumbnail: ChannelThumbnail[];
    channelBadges: string[];
    subscriberCountText: string;
    subscriberCount: number;
    commentCountText: string;
    commentCount: number;
    relatedVideos: RelatedVideos;
}
  
export interface Thumbnail {
    url: string;
    width: number;
    height: number;
}
  
export interface Subtitles {
    subtitles: Subtitle[];
    format: string;
    translationLanguages: TranslationLanguage[];
}
  
export interface Subtitle {
    languageName: string;
    languageCode: string;
    isTranslatable: boolean;
    url: string;
}
  
export interface TranslationLanguage {
    languageCode: string;
    languageName: string;
}
  
export interface Storyboard {
    width: string;
    height: string;
    thumbsCount: string;
    columns: string;
    rows: string;
    interval: string;
    storyboardCount: number;
    url: string[];
}
  
export interface ChannelThumbnail {
    url: string;
    width: number;
    height: number;
}
  
export interface RelatedVideos {
    continuation: string;
    data: Daum[];
}
  
export interface Daum {
    type: string;
    videoId: string;
    title: string;
    lengthText: string;
    viewCount: string;
    publishedTimeText: string;
    thumbnail: Thumbnail2[];
    channelTitle: string;
    channelId: string;
    channelThumbnail: ChannelThumbnail2[];
}
  
export interface Thumbnail2 {
    url: string;
    width: number;
    height: number;
}
  
export interface ChannelThumbnail2 {
    url: string;
    width: number;
    height: number;
}

export interface SubtitlesResponse {
    subtitles: Subtitle[];
    format: string;
    msg: string;
    translationLanguages: TranslationLanguage[];
}
  
export interface Subtitle {
    languageName: string;
    languageCode: string;
    isTranslatable: boolean;
    url: string;
}
  
export interface TranslationLanguage {
    languageCode: string;
    languageName: string;
}
  
  