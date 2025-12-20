import { AsyncCommand } from "@puremvc/puremvc-typescript-util-async-command";
import { INotification } from "@puremvc/puremvc-typescript-multicore-framework";

export class LoadUserAndPostsCommand extends AsyncCommand {
  public async execute(note: INotification): Promise<void> {
    try {
      const { userId } = note.body as { userId: string };
      const [userRes, postsRes] = await Promise.all([
        fetch(`/api/users/${userId}`),
        fetch(`/api/users/${userId}/posts`),
      ]);
      const [user, posts] = await Promise.all([
        userRes.json(),
        postsRes.json(),
      ]);
      this.sendNotification("USER_AND_POSTS_LOADED", { user, posts });
    } finally {
      this.commandComplete();
    }
  }
}
