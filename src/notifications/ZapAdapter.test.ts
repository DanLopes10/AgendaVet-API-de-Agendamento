import { ZapAdapter } from './ZapAdapter';
import { ZapLegacySDK } from '../libs/zap-legacy-sdk';

describe('ZapAdapter', () => {
  it('acrescenta o DDI 55 ao telefone', () => {
    const dispararMsg = jest.fn().mockReturnValue({ ok: true });
    const adapter = new ZapAdapter({ dispararMsg } as unknown as ZapLegacySDK);

    adapter.enviar('31999990000', 'Olá');

    expect(dispararMsg).toHaveBeenCalledWith('5531999990000', { txt: 'Olá' });
  });

  it('lança erro quando a SDK responde ok: false', () => {
    const dispararMsg = jest.fn().mockReturnValue({ ok: false });
    const adapter = new ZapAdapter({ dispararMsg } as unknown as ZapLegacySDK);

    expect(() => adapter.enviar('31999990000', 'Olá')).toThrow('Falha ao notificar');
  });
});
