import { describe, it, expect } from 'vitest'
import { mentionParser, csvFormatter, arraryContainCheck } from './helper';

describe('regpx', () => {
    it('mentionParser', () => {
        expect(mentionParser('《BEASTARS》\n《動物方城市》')).toEqual(['BEASTARS', '動物方城市']);
        expect(mentionParser('真的不要再把藤本樹念藤井樹《魔都精兵的奴隸》《青春養成記 Turning Red》《再見繪梨》')).toEqual(['魔都精兵的奴隸', '青春養成記 Turning Red', '再見繪梨'])
    })
})

describe('csv', () => {
    it('csvFormatter', () => {
        const csvArrary = [
            ['ep', 'title', 'createAt'],
            ['EP0', 'BEASTARS 這本獸控漫畫真厲害', '2018/10/20'],
            ['EP01', '打開影展的方式', '2018/10/25'],
        ]
        const json = [
            {
                ep: 'EP0',
                title: 'BEASTARS 這本獸控漫畫真厲害',
                createAt: '2018/10/20',
            },
            {
                ep: 'EP01',
                title: '打開影展的方式',
                createAt: '2018/10/25',
            },            
        ]
        expect(csvFormatter(csvArrary)).toEqual(json);
    })
})

describe('checkArrayContain', () => {
    it('check array contain', () => {
        const trueTarget = ['food', 'is', 'good'];
        const falseTarget = ['food', 'is', 'nice'];
        const keywords = ['bad', 'good'];
        expect(arraryContainCheck(trueTarget, keywords)).toBe(true);
        expect(arraryContainCheck(falseTarget, keywords)).toBe(false);
    })
})