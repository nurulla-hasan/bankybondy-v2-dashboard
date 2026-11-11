import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { SkillPayload, SkillsQuery } from "@/types";
import {
  createSkill,
  deleteSkill,
  getSkills,
  updateSkill,
} from "../api/skills.api";

export const skillsKeys = {
  all: ["skills"] as const,
  list: (query: SkillsQuery) => ["skills", "list", query] as const,
};

export function useSkills(query: SkillsQuery) {
  return useQuery({
    queryKey: skillsKeys.list(query),
    queryFn: async () => (await getSkills(query)).data,
    // Keep the previous page visible while the next one loads.
    placeholderData: keepPreviousData,
  });
}

export function useCreateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillsKeys.all }),
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      skillId,
      payload,
    }: {
      skillId: string;
      payload: SkillPayload;
    }) => updateSkill(skillId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillsKeys.all }),
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSkill,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: skillsKeys.all }),
  });
}
