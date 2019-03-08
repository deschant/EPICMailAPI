import { body, header, param } from 'express-validator/check';
import token from '../helpers/token';

export default (method) => {
  const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})');

  switch (method) {
    case 'checkToken': {
      return [
        // eslint-disable-next-line consistent-return
        header('token', 'Token is missing or expired').custom(async (value, { req }) => {
          try {
            const result = await token.verifyToken(value);
            if (result) {
              req.token = result;
              return true;
            }

            if (result === false) {
              return result;
            }
          } catch (error) {
            return new Error('Token is empty or invalid');
          }
        }),
      ];
    }

    case 'getOne': {
      return [
        param('messageId', 'Message id is required in route params')
          .not().isEmpty()
          .toInt(10),
        // eslint-disable-next-line consistent-return
        header('token', 'Token is missing or expired').custom(async (value, { req }) => {
          try {
            const result = await token.verifyToken(value);
            if (result) {
              req.token = result;
              return true;
            }

            if (result === false) {
              return result;
            }
          } catch (error) {
            return new Error('Token is empty or invalid');
          }
        }),
      ];
    }

    case 'createUser': {
      return [
        body('firstName', 'firstName is required')
          .not().isEmpty()
          .trim()
          .escape(),
        body('lastName', 'lastName is required')
          .not().isEmpty()
          .trim()
          .escape(),
        body('email', 'Invalid email')
          .isEmail()
          .normalizeEmail(),
        body('password', 'Password is missing or invalid')
          .not().isEmpty()
          .matches(passwordRegex),
      ];
    }

    case 'signin': {
      return [
        body('email', 'Valid email is required')
          .isEmail()
          .normalizeEmail(),
        body('password', 'Password is invalid')
          .not().isEmpty()
          .matches(passwordRegex),
      ];
    }

    case 'newMessage': {
      return [
        // eslint-disable-next-line consistent-return
        header('token', 'Token is missing or expired').custom(async (value, { req }) => {
          try {
            const result = await token.verifyToken(value);
            if (result) {
              req.token = result;
              return true;
            }

            if (result === false) {
              return result;
            }
          } catch (error) {
            return new Error('Token is empty or invalid');
          }
        }),
        body('from', 'Email address of sender is missing or invalid')
          .isEmail()
          .normalizeEmail(),
        body('to', 'Email address of recipient is missing or invalid')
          .isEmail()
          .normalizeEmail(),
        body('subject', 'Subject is required')
          .not().isEmpty()
          .isString(),
        body('message', 'Email must contain a message')
          .not().isEmpty()
          .isString(),
        body('status', 'Message status is required')
          .not().isEmpty()
          .isIn(['draft', 'sent', 'read']),
        body('parentMessageId', 'parentMessageId is required. 0 if initial message')
          .isInt(),
      ];
    }

    default:
      return [];
  }
};
