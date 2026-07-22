export type UserResponse = {
  id: string;
  username: string;
  email: string;
  avatarImageUrl: string;
  roles: string[];
};

export type UserRequest = {
  username: string;
  email: string;
  avatarImageUrl?: string;
  roles?: string[];
};
