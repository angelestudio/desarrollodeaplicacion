export type Guest = {
  name: string;
  email: string;
};

export interface Post {
  _id: string;
  title: string;
  content: string;
  club: string;
  user: string; // userId del autor
  likesCount?: number;
  likedBy?: string[];
}