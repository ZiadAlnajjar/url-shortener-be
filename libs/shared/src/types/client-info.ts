import { ClickEventPayload } from '../dto';

export type ClientInfo = Omit<ClickEventPayload, 'linkId'>;
