import { Params } from 'nestjs-pino/params';
import pino from 'pino';

const LOG_LEVEL = {
	TRACE: 'trace',
	DEBUG: 'debug',
	INFO: 'info',
	WARN: 'warn',
	ERROR: 'error',
	FATAL: 'fatal',
} as const;

export const PinoLoggerParams: Params = {
	pinoHttp: {
		customLogLevel: function (
			req,
			res,
			err: Error | undefined,
		): pino.LevelWithSilent {
			const badRequestResponseCode = 400;
			const serverErrorResponseCode = 500;

			if (
				res.statusCode >= badRequestResponseCode &&
				res.statusCode < serverErrorResponseCode
			) {
				return LOG_LEVEL.WARN;
			} else if (res.statusCode >= serverErrorResponseCode || err) {
				return LOG_LEVEL.ERROR;
			}

			return LOG_LEVEL.DEBUG;
		},
		level: LOG_LEVEL.DEBUG,
		quietReqLogger: true,
		customProps: () => ({
			context: 'HTTP',
		}),
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				singleLine: true,
			},
		},
	},
};
