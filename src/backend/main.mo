import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";



actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type User = {
    displayName : Text;
    bio : Text;
    avatarUrl : Text;
    followerCount : Nat;
    followingCount : Nat;
  };

  public type VideoPost = {
    title : Text;
    description : Text;
    hashtags : [Text];
    category : Text;
    videoUrl : Text;
    thumbnailUrl : Text;
    likeCount : Nat;
    commentCount : Nat;
    creator : Principal;
    createdAt : Int;
  };

  public type Comment = {
    videoId : Nat;
    text : Text;
    author : Principal;
    createdAt : Int;
  };

  public type Notification = {
    notificationType : {
      #like;
      #follow;
      #comment;
    };
    fromUser : Principal;
    videoId : ?Nat;
    read : Bool;
  };

  type Category = {
    #bollywood;
    #cricket;
    #dance;
    #comedy;
    #food;
    #travel;
    #lifestyle;
    #other;
  };

  var nextVideoId = 0;
  var nextCommentId = 0;

  let users = Map.empty<Principal, User>();
  let videos = Map.empty<Nat, VideoPost>();
  let comments = Map.empty<Nat, Comment>();
  let notifications = Map.empty<Principal, List.List<Notification>>();
  let likes = Map.empty<Nat, List.List<Principal>>();
  let followers = Map.empty<Principal, List.List<Principal>>();
  let following = Map.empty<Principal, List.List<Principal>>();

  public shared ({ caller }) func createUser(displayName : Text, bio : Text, avatarUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create profiles");
    };
    if (users.containsKey(caller)) { Runtime.trap("User already exists") };
    let user : User = {
      displayName;
      bio;
      avatarUrl;
      followerCount = 0;
      followingCount = 0;
    };
    users.add(caller, user);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?User {
    users.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : User) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    users.add(caller, profile);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?User {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    users.get(caller);
  };

  public query func searchUsers(searchTerm : Text) : async [User] {
    let filteredUsers = users.values().filter(
      func(user) {
        user.displayName.contains(#text searchTerm);
      }
    );
    filteredUsers.toArray();
  };

  public shared ({ caller }) func updateUser(displayName : Text, bio : Text, avatarUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("User not found") };
      case (?user) {
        let updatedUser = {
          displayName;
          bio;
          avatarUrl;
          followerCount = user.followerCount;
          followingCount = user.followingCount;
        };
        users.add(caller, updatedUser);
      };
    };
  };

  public shared ({ caller }) func createVideo(title : Text, description : Text, hashtags : [Text], category : Text, videoUrl : Text, thumbnailUrl : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create videos");
    };
    let video : VideoPost = {
      title;
      description;
      hashtags;
      category;
      videoUrl;
      thumbnailUrl;
      likeCount = 0;
      commentCount = 0;
      creator = caller;
      createdAt = Time.now();
    };
    let videoId = nextVideoId;
    videos.add(videoId, video);
    nextVideoId += 1;
    videoId;
  };

  public query func getVideo(id : Nat) : async ?VideoPost {
    videos.get(id);
  };

  public query func getAllVideos() : async [VideoPost] {
    videos.values().toArray();
  };

  public query func getVideosByCreator(creator : Principal) : async [VideoPost] {
    let filteredVideos = videos.values().filter(
      func(video) {
        if (creator == video.creator) { true } else { false };
      }
    );
    filteredVideos.toArray();
  };

  public query func getVideosByCategory(category : Text) : async [VideoPost] {
    let filteredVideos = videos.values().filter(
      func(video) {
        video.category == category;
      }
    );
    filteredVideos.toArray();
  };

  public query func searchVideos(searchTerm : Text) : async [VideoPost] {
    let filteredVideos = videos.values().filter(
      func(video) {
        video.title.contains(#text searchTerm) or video.description.contains(#text searchTerm);
      }
    );
    filteredVideos.toArray();
  };

  public query func getPagedVideos(page : Nat, pageSize : Nat) : async [VideoPost] {
    let sortedVideos = videos.values().toArray().sort(func(a, b) { Int.compare(b.createdAt, a.createdAt) });

    let startInt = page * pageSize;
    let endInt = Nat.min((page + 1) * pageSize, sortedVideos.size());

    let start = if (startInt < 0) { 0 } else { startInt };
    let end = if (endInt < 0) { 0 } else { endInt };

    let safeStart = if (start >= 0) { start.toNat() } else { 0 };
    let safeEnd = if (end >= 0) { end.toNat() } else { 0 };

    if (safeStart >= sortedVideos.size()) {
      [];
    } else {
      if (safeEnd > sortedVideos.size()) {
        sortedVideos.sliceToArray(safeStart, sortedVideos.size());
      } else {
        sortedVideos.sliceToArray(safeStart, safeEnd);
      };
    };
  };

  public shared ({ caller }) func likeVideo(videoId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can like videos");
    };
    let video = switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video };
    };
    let videoLikes = switch (likes.get(videoId)) {
      case (null) { List.empty<Principal>() };
      case (?existingLikes) { existingLikes };
    };

    if (videoLikes.contains(caller)) {
      Runtime.trap("User already liked this video");
    };

    videoLikes.add(caller);
    likes.add(videoId, videoLikes);

    let updatedVideo = {
      video with likeCount = video.likeCount + 1;
    };
    videos.add(videoId, updatedVideo);

    let notification : Notification = {
      notificationType = #like;
      fromUser = caller;
      videoId = ?videoId;
      read = false;
    };
    addNotification(video.creator, notification);
  };

  public shared ({ caller }) func unlikeVideo(videoId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unlike videos");
    };
    let video = switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video };
    };
    let videoLikes = switch (likes.get(videoId)) {
      case (null) { List.empty<Principal>() };
      case (?existingLikes) { existingLikes };
    };

    if (not videoLikes.contains(caller)) {
      Runtime.trap("User has not liked this video");
    };

    let filteredLikes = videoLikes.filter(func(userId) { userId != caller });
    likes.add(videoId, filteredLikes);

    let updatedVideo = {
      video with likeCount = if (video.likeCount > 0) { video.likeCount - 1 } else { 0 };
    };
    videos.add(videoId, updatedVideo);
  };

  public shared ({ caller }) func addComment(videoId : Nat, text : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add comments");
    };
    let video = switch (videos.get(videoId)) {
      case (null) { Runtime.trap("Video not found") };
      case (?video) { video };
    };
    let comment : Comment = {
      videoId;
      text;
      author = caller;
      createdAt = Time.now();
    };
    let commentId = nextCommentId;
    comments.add(commentId, comment);
    nextCommentId += 1;
    let updatedVideo = {
      video with commentCount = video.commentCount + 1;
    };
    videos.add(videoId, updatedVideo);
    let notification : Notification = {
      notificationType = #comment;
      fromUser = caller;
      videoId = ?videoId;
      read = false;
    };
    addNotification(video.creator, notification);
    commentId;
  };

  public query func getComments(videoId : Nat) : async [Comment] {
    let filteredComments = comments.values().filter(
      func(comment) {
        comment.videoId == videoId;
      }
    );
    filteredComments.toArray();
  };

  public shared ({ caller }) func followUser(followee : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can follow others");
    };
    if (caller == followee) {
      Runtime.trap("Cannot follow yourself");
    };
    let userFollowers = switch (followers.get(followee)) {
      case (null) { List.empty<Principal>() };
      case (?f) { f };
    };
    if (userFollowers.contains(caller)) {
      Runtime.trap("Already following this user");
    };
    userFollowers.add(caller);
    followers.add(followee, userFollowers);

    let currentUserFollowing = switch (following.get(caller)) {
      case (null) { List.empty<Principal>() };
      case (?f) { f };
    };
    currentUserFollowing.add(followee);
    following.add(caller, currentUserFollowing);

    switch (users.get(followee)) {
      case (null) { Runtime.trap("Target user does not exist") };
      case (?followedUser) {
        let updatedFollowedUser = {
          followedUser with followerCount = followedUser.followerCount + 1;
        };
        users.add(followee, updatedFollowedUser);
      };
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("Current user does not exist") };
      case (?currentUser) {
        let updatedCurrentUser = {
          currentUser with followingCount = currentUser.followingCount + 1;
        };
        users.add(caller, updatedCurrentUser);
      };
    };
    let notification : Notification = {
      notificationType = #follow;
      fromUser = caller;
      videoId = null;
      read = false;
    };
    addNotification(followee, notification);
  };

  public shared ({ caller }) func unfollowUser(followee : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can unfollow others");
    };
    if (caller == followee) {
      Runtime.trap("Cannot unfollow yourself");
    };
    let userFollowers = switch (followers.get(followee)) {
      case (null) { List.empty<Principal>() };
      case (?f) { f };
    };

    if (not userFollowers.contains(caller)) {
      Runtime.trap("Not following this user");
    };

    let filteredFollowers = userFollowers.filter(func(followerId) { followerId != caller });
    followers.add(followee, filteredFollowers);

    let currentUserFollowing = switch (following.get(caller)) {
      case (null) { List.empty<Principal>() };
      case (?f) { f };
    };

    let filteredFollowing = currentUserFollowing.filter(func(followingId) { followingId != followee });
    following.add(caller, filteredFollowing);

    switch (users.get(followee)) {
      case (null) { Runtime.trap("Target user does not exist") };
      case (?followedUser) {
        let updatedFollowedUser = {
          followedUser with followerCount = if (followedUser.followerCount > 0) { followedUser.followerCount - 1 } else { 0 };
        };
        users.add(followee, updatedFollowedUser);
      };
    };
    switch (users.get(caller)) {
      case (null) { Runtime.trap("Current user does not exist") };
      case (?currentUser) {
        let updatedCurrentUser = {
          currentUser with followingCount = if (currentUser.followingCount > 0) { currentUser.followingCount - 1 } else { 0 };
        };
        users.add(caller, updatedCurrentUser);
      };
    };
  };

  public query func getFollowers(userId : Principal) : async [Principal] {
    switch (followers.get(userId)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public query func getFollowing(userId : Principal) : async [Principal] {
    switch (following.get(userId)) {
      case (null) { [] };
      case (?list) { list.toArray() };
    };
  };

  public query ({ caller }) func getNotifications() : async [Notification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access notifications");
    };
    switch (notifications.get(caller)) {
      case (null) { [] };
      case (?n) { n.toArray() };
    };
  };

  public shared ({ caller }) func markNotificationsRead() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can mark notifications as read");
    };
    switch (notifications.get(caller)) {
      case (null) { () };
      case (?n) {
        let updatedNotifications = n.map<Notification, Notification>(
          func(notification) {
            { notification with read = true };
          }
        );
        notifications.add(caller, updatedNotifications);
      };
    };
  };

  private func addNotification(userId : Principal, notification : Notification) {
    let existingNotifications = switch (notifications.get(userId)) {
      case (null) { List.empty<Notification>() };
      case (?n) { n };
    };
    existingNotifications.add(notification);
    notifications.add(userId, existingNotifications);
  };
};
