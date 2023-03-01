import { describe, it, expect } from 'vitest'
import { mentionParser } from './parser';
describe('regpx', () => {
    it('mentionParser', () => {
        expect(mentionParser('《BEASTARS》\n《動物方城市》')).toEqual(['BEASTARS', '動物方城市']);
        expect(mentionParser('真的不要再把藤本樹念藤井樹《魔都精兵的奴隸》《青春養成記 Turning Red》《再見繪梨》')).toEqual(['魔都精兵的奴隸', '青春養成記 Turning Red', '再見繪梨'])
    })
})