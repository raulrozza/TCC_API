import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import errorCodes from '@config/errorCodes';
import { RequestError } from '@shared/infra/errors';

import IUpdateActivityDTO from '@modules/games/domain/dtos/IUpdateActivityDTO';
import { IActivity } from '@modules/games/domain/entities';
import { IActivitiesRepository } from '@modules/games/domain/repositories';
import ActivityLog from '@modules/games/domain/adapters/ActivityLog';
import UpdateActivityAdapter from '@modules/games/domain/adapters/UpdateActivity';

@injectable()
export default class UpdateActivityService {
  constructor(
    @inject('ActivitiesRepository')
    private activitiesRepository: IActivitiesRepository,
  ) {}

  public async execute({
    gameId,
    userId,
    id,
    name,
    experience,
    description,
    dmRules,
  }: IUpdateActivityDTO): Promise<IActivity> {
    try {
      const foundActivity = await this.activitiesRepository.findOne(id, gameId);

      if (!foundActivity)
        throw new RequestError(
          'This activity does not exist',
          errorCodes.RESOURCE_NOT_FOUND,
          400,
        );

      const activityLog = new ActivityLog(foundActivity, {
        userId,
        name,
        experience,
        description,
        dmRules,
      });

      const activity = new UpdateActivityAdapter({
        id,
        name,
        experience,
        description,
        dmRules,
        gameId,
        activityLog,
      });

      const updatedActivity = await this.activitiesRepository.update(activity);

      return updatedActivity;
    } catch (error) {
      if (error instanceof RequestError) throw error;

      throw new RequestError(
        error.message,
        errorCodes.INTERNAL_SERVER_ERROR,
        500,
      );
    }
  }
}
