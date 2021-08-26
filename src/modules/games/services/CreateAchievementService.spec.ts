import { RequestError } from '@shared/infra/errors';
import { v4 as uuid } from 'uuid';
import FakeAchievementsRepository from '@modules/games/domain/repositories/fakes/FakeAchievementsRepository';
import CreateAchievementService from './CreateAchievementService';
import { ITitle } from '@shared/domain/entities';
import { FakeAchievement, FakeTitle } from '@shared/domain/entities/fakes';
import { FakeTitlesRepository } from '@shared/domain/repositories/fakes';

describe('CreateAchievementService', () => {
  it('should create the achievement with title', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const titlesRepository = new FakeTitlesRepository();
    const createAchievement = new CreateAchievementService(
      achievementsRepository,
      titlesRepository,
    );

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement({ game: gameId });
    const fakeTitle = new FakeTitle({ game: gameId });

    const title = await titlesRepository.create({
      name: fakeTitle.name,
      game: fakeTitle.game,
    } as ITitle);

    const payload = {
      gameId,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      title: title.id,
    };

    const achievement = await createAchievement.execute(payload);

    expect(achievement).toHaveProperty('id');
    expect(achievement.name).toBe(fakeAchievement.name);
    expect(achievement.description).toBe(fakeAchievement.description);
    expect(achievement.title).toBe(title.id);
  });

  it('should create the achievement without a title', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const titlesRepository = new FakeTitlesRepository();
    const createAchievement = new CreateAchievementService(
      achievementsRepository,
      titlesRepository,
    );

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement({ game: gameId });

    const payload = {
      gameId,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
    };

    const achievement = await createAchievement.execute(payload);

    expect(achievement).toHaveProperty('id');
    expect(achievement.name).toBe(fakeAchievement.name);
    expect(achievement.description).toBe(fakeAchievement.description);
  });

  it('should throw when creating the achievement with an unexisting title', async () => {
    const achievementsRepository = new FakeAchievementsRepository();
    const titlesRepository = new FakeTitlesRepository();
    const createAchievement = new CreateAchievementService(
      achievementsRepository,
      titlesRepository,
    );

    const gameId = uuid();
    const fakeAchievement = new FakeAchievement({ game: gameId });

    const payload = {
      gameId,
      name: fakeAchievement.name,
      description: fakeAchievement.description,
      title: 'fake title',
    };

    await expect(createAchievement.execute(payload)).rejects.toBeInstanceOf(
      RequestError,
    );
  });
});
