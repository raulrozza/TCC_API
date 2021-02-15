import 'reflect-metadata';
import { inject, injectable } from 'tsyringe';

import {
  IActivitiesRepository,
  IGamesRepository,
} from '@modules/games/repositories';
import {
  ICompleteActivityRequestRepository,
  IPlayersRepository,
} from '@modules/players/repositories';
import { ICompleteActivityRequest } from '@modules/players/entities';
import ICreateCompleteActivityRequestDTO from '@modules/players/dtos/ICreateCompleteActivityRequestDTO';
import { RequestError } from '@shared/errors/implementations';
import errorCodes from '@config/errorCodes';
import ITransactionProvider from '@shared/container/providers/TransactionProvider/models/ITransactionProvider';

interface IValidateInputParams {
  activity: string;
  gameId: string;
  userId: string;
  requester: string;
}

@injectable()
export default class CreateCompleteActivityRequestService {
  constructor(
    @inject('CompleteActivityRequestRepository')
    private completeActivityRequestRepository: ICompleteActivityRequestRepository,

    @inject('GamesRepository')
    private gamesRepository: IGamesRepository,

    @inject('ActivitiesRepository')
    private activitiesRepository: IActivitiesRepository,

    @inject('PlayersRepository')
    private playersRepository: IPlayersRepository,

    @inject('TransactionProvider')
    private transactionProvider: ITransactionProvider,
  ) {}

  public async execute({
    activity,
    gameId,
    userId,
    requester,
    completionDate,
    information,
    requestDate,
  }: ICreateCompleteActivityRequestDTO): Promise<ICompleteActivityRequest> {
    await this.validateInput({ activity, gameId, userId, requester });

    return await this.transactionProvider.startSession(async session => {
      const request = await this.completeActivityRequestRepository.create(
        {
          activity,
          game: gameId,
          requester,
          completionDate,
          information,
          requestDate,
        },
        session,
      );

      await this.gamesRepository.updateRegisters(gameId, 1, session);

      return request;
    });
  }

  private async validateInput({
    activity,
    gameId,
    userId,
    requester,
  }: IValidateInputParams): Promise<void> {
    const game = await this.gamesRepository.findOne(gameId);
    if (!game)
      throw new RequestError(
        'This game does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const foundActivity = await this.activitiesRepository.findOne(
      activity,
      gameId,
    );
    if (!foundActivity)
      throw new RequestError(
        'This activity does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );

    const player = await this.playersRepository.findOne(
      requester,
      userId,
      gameId,
    );
    if (!player)
      throw new RequestError(
        'This player does not exist',
        errorCodes.BAD_REQUEST_ERROR,
      );
  }
}