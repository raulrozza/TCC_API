import express from 'express';
import multer from 'multer';
import uploadConfig from '@config/upload';

import {
  GameAvatarController,
  GameController,
} from '@modules/games/infra/http/controllers';
import verifyGameSelected from '@modules/games/infra/http/middlewares/verifyGameSelected';
import verifyAuthentication from '@modules/users/infra/http/middlewares/verifyAuthentication';

const gameController = new GameController();
const gameAvatarController = new GameAvatarController();

const gameRoutes = express.Router();
const upload = multer(uploadConfig.multerConfig);

gameRoutes.patch(
  '/avatar',
  verifyAuthentication,
  verifyGameSelected,
  upload.single('image'),
  gameAvatarController.update,
);
gameRoutes.post('/', verifyAuthentication, gameController.store);

export default gameRoutes;