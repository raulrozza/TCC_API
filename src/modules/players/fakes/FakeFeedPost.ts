import { IFeedPost } from '../entities';

export default class FakeFeedPost implements IFeedPost {
  public id: string = '';
  public date: Date = new Date();
  constructor(
    public player: string,
    public game: string,
    public type: IFeedPost['type'],
  ) {}
}