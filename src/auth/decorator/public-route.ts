import { SetMetadata } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PublicRoute = () => SetMetadata('PUBLIC_ROUTE', true);
