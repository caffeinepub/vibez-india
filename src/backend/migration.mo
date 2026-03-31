import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type OldUser = {
    displayName : Text;
    bio : Text;
    avatarUrl : Text;
    followerCount : Nat;
    followingCount : Nat;
    facebookConnected : Bool;
  };

  type OldActor = {
    users : Map.Map<Principal, OldUser>;
    nextVideoId : Nat;
    nextCommentId : Nat;
  };

  type NewUser = {
    displayName : Text;
    bio : Text;
    avatarUrl : Text;
    followerCount : Nat;
    followingCount : Nat;
  };

  type NewActor = {
    users : Map.Map<Principal, NewUser>;
    nextVideoId : Nat;
    nextCommentId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let users = old.users.map<Principal, OldUser, NewUser>(
      func(_p, old) {
        {
          displayName = old.displayName;
          bio = old.bio;
          avatarUrl = old.avatarUrl;
          followerCount = old.followerCount;
          followingCount = old.followingCount;
        };
      }
    );
    { old with users };
  };
};
