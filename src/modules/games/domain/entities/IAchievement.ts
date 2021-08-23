import { IGame, ITitle } from '.';

export default interface IAchievement {
  id: string;
  name: string;
  description: string;
  title?: ITitle;
  image?: string;
  image_url?: string;
  game: IGame;
}
