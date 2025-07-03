const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

const CURRENT_LOG_LEVEL = LOG_LEVELS.DEBUG;

export class Logger {
    private static log(level: number, message: string, ...optionalParams: any[]) {
        if (level >= CURRENT_LOG_LEVEL) {
            const timestamp = new Date().toISOString();
            const levelName = Object.keys(LOG_LEVELS).find(key => LOG_LEVELS[key as keyof typeof LOG_LEVELS] === level);

            console.log(`[${timestamp}] [${levelName}] ${message}`, ...optionalParams);
        }
    }

    public static debug(message: string, ...optionalParams: any[]) {
        this.log(LOG_LEVELS.DEBUG, message, ...optionalParams);
    }

    public static info(message: string, ...optionalParams: any[]) {
        this.log(LOG_LEVELS.INFO, message, ...optionalParams);
    }

    public static warn(message: string, ...optionalParams: any[]) {
        this.log(LOG_LEVELS.WARN, message, ...optionalParams);
    }

    public static error(message: string, ...optionalParams: any[]) {
        this.log(LOG_LEVELS.ERROR, message, ...optionalParams);
    }
}
