import { config } from 'dotenv';

export const getEnvOrThrow = (envVariableName: string): string => {
  const parsed = config().parsed;
  if (!parsed || !(envVariableName in parsed)) {
    throw new Error(`Var with name: ${envVariableName} is not provided!`);
  }
  return parsed[envVariableName];
};
