import sys, asyncio
from playwright.async_api import async_playwright
URL = sys.argv[1]
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vp, dpr in [('v2-desktop-1440', {'width':1440,'height':900}, 1), ('v2-mobile-390', {'width':390,'height':844}, 2), ('v2-at-1127', {'width':1127,'height':800}, 1)]:
            pg = await b.new_page(viewport=vp, device_scale_factor=dpr)
            errs=[]; pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
            pg.on('requestfailed', lambda r: errs.append('FAILED '+r.url))
            pg.on('response', lambda r: errs.append(f'{r.status} {r.url}') if r.status>=400 else None)
            await pg.goto(URL, wait_until='networkidle')
            h = await pg.evaluate('document.body.scrollHeight')
            for y in range(0, h, 300):
                await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(50)
            await pg.wait_for_timeout(1300); await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(300)
            await pg.screenshot(path=f'shots/{name}.png', full_page=True)
            ow = await pg.evaluate('document.documentElement.scrollWidth > window.innerWidth')
            print(name, h, 'overflowX', ow, errs)
        await b.close()
asyncio.run(main())
