# Vibez India

## Current State
Fresh workspace - rebuilding from conversation history.

## Requested Changes (Diff)

### Add
- TikTok-style snap-scrolling vertical video feed with Indian sample content
- Category filter: Bollywood, Cricket, Dance, Comedy, Food, Travel, Lifestyle
- Trending hashtags: #IPL2024, #Diwali, #Bhangra
- Like, comment, share (WhatsApp & Facebook) on video cards
- Double-tap-to-like gesture
- Discover tab: trending hashtags, popular Indian creators, searchable video grid
- Upload tab: drag-and-drop video upload with metadata and category
- Notifications tab: likes, follows, comments with unread badges
- Profile tab: stats grid, video grid, Internet Identity login
- WhatsApp and Facebook share buttons on every video card
- Facebook connect button on profile

### Modify
- N/A (new build)

### Remove
- N/A

## Implementation Plan
1. Generate Motoko backend with video metadata, likes, comments, user profiles
2. Build React frontend with 5 tabs: Home, Discover, Upload, Notifications, Profile
3. Dark UI with saffron-orange #F4A23B accents
4. Sample Indian content with mock video thumbnails
5. WhatsApp/Facebook share via web share / direct links
