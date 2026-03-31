import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Notification, User, VideoPost } from "../backend.d";
import { useActor } from "./useActor";

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery<User | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetAllVideos() {
  const { actor, isFetching } = useActor();
  return useQuery<VideoPost[]>({
    queryKey: ["allVideos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVideos();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVideosByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<VideoPost[]>({
    queryKey: ["videosByCategory", category],
    queryFn: async () => {
      if (!actor) return [];
      if (category === "All") return actor.getAllVideos();
      return actor.getVideosByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetNotifications() {
  const { actor, isFetching } = useActor();
  return useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNotifications();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useMarkNotificationsRead() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not available");
      return actor.markNotificationsRead();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

export function useLikeVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: bigint) => {
      if (!actor) throw new Error("Not available");
      return actor.likeVideo(videoId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allVideos"] }),
  });
}

export function useUnlikeVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (videoId: bigint) => {
      if (!actor) throw new Error("Not available");
      return actor.unlikeVideo(videoId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allVideos"] }),
  });
}

export function useCreateVideo() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      hashtags: string[];
      category: string;
      videoUrl: string;
      thumbnailUrl: string;
    }) => {
      if (!actor) throw new Error("Not available");
      return actor.createVideo(
        data.title,
        data.description,
        data.hashtags,
        data.category,
        data.videoUrl,
        data.thumbnailUrl,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allVideos"] }),
  });
}

export function useSearchVideos(term: string) {
  const { actor, isFetching } = useActor();
  return useQuery<VideoPost[]>({
    queryKey: ["searchVideos", term],
    queryFn: async () => {
      if (!actor || !term) return [];
      return actor.searchVideos(term);
    },
    enabled: !!actor && !isFetching && term.length > 0,
  });
}

export function useCreateUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      displayName: string;
      bio: string;
      avatarUrl: string;
    }) => {
      if (!actor) throw new Error("Not available");
      return actor.createUser(data.displayName, data.bio, data.avatarUrl);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}

export function useUpdateUser() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      displayName: string;
      bio: string;
      avatarUrl: string;
    }) => {
      if (!actor) throw new Error("Not available");
      return actor.updateUser(data.displayName, data.bio, data.avatarUrl);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["currentUserProfile"] }),
  });
}
