type Team = "exploratori" | "reporteri" | "cercetatori";
interface TokenDoc {
  token: string;
}
interface UserData {
  email: string;
  displayEmail?: boolean;
  username: string;
  name: string;
  blogPosts?: string[];
  photoURL?: string;
  team?: Team;
  socials?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}
