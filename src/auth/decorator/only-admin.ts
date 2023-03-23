import { SetMetadata } from '@nestjs/common';

export const onlyAdmin = () => SetMetadata('onlyAdmin', true);
