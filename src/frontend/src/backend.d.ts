import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Comment {
    createdAt: bigint;
    text: string;
    author: Principal;
    videoId: bigint;
}
export interface User {
    bio: string;
    displayName: string;
    avatarUrl: string;
    followerCount: bigint;
    followingCount: bigint;
}
export interface Notification {
    notificationType: Variant_like_comment_follow;
    read: boolean;
    fromUser: Principal;
    videoId?: bigint;
}
export interface VideoPost {
    title: string;
    creator: Principal;
    likeCount: bigint;
    thumbnailUrl: string;
    hashtags: Array<string>;
    createdAt: bigint;
    description: string;
    commentCount: bigint;
    category: string;
    videoUrl: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_like_comment_follow {
    like = "like",
    comment = "comment",
    follow = "follow"
}
export interface backendInterface {
    addComment(videoId: bigint, text: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createUser(displayName: string, bio: string, avatarUrl: string): Promise<void>;
    createVideo(title: string, description: string, hashtags: Array<string>, category: string, videoUrl: string, thumbnailUrl: string): Promise<bigint>;
    followUser(followee: Principal): Promise<void>;
    getAllVideos(): Promise<Array<VideoPost>>;
    getCallerUserProfile(): Promise<User | null>;
    getCallerUserRole(): Promise<UserRole>;
    getComments(videoId: bigint): Promise<Array<Comment>>;
    getFollowers(userId: Principal): Promise<Array<Principal>>;
    getFollowing(userId: Principal): Promise<Array<Principal>>;
    getNotifications(): Promise<Array<Notification>>;
    getPagedVideos(page: bigint, pageSize: bigint): Promise<Array<VideoPost>>;
    getUserProfile(user: Principal): Promise<User | null>;
    getVideo(id: bigint): Promise<VideoPost | null>;
    getVideosByCategory(category: string): Promise<Array<VideoPost>>;
    getVideosByCreator(creator: Principal): Promise<Array<VideoPost>>;
    isCallerAdmin(): Promise<boolean>;
    likeVideo(videoId: bigint): Promise<void>;
    markNotificationsRead(): Promise<void>;
    saveCallerUserProfile(profile: User): Promise<void>;
    searchUsers(searchTerm: string): Promise<Array<User>>;
    searchVideos(searchTerm: string): Promise<Array<VideoPost>>;
    unfollowUser(followee: Principal): Promise<void>;
    unlikeVideo(videoId: bigint): Promise<void>;
    updateUser(displayName: string, bio: string, avatarUrl: string): Promise<void>;
}
