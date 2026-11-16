import sys, asyncio
from playwright.async_api import async_playwright
URL = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8765/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        for name, vp, dpr in [('desktop-1440', {'width':1440,'height':900}, 1), ('mobile-390', {'width':390,'height':844}, 2)]:
            pg = await b.new_page(viewport=vp, device_scale_factor=dpr)
            errs=[]; pg.on('console', lambda m: errs.append(m.text) if m.type=='error' else None)
            pg.on('requestfailed', lambda r: errs.append('FAILED '+r.url))
            await pg.goto(URL, wait_until='networkidle')
            h = await pg.evaluate('document.body.scrollHeight')
            for y in range(0, h, 300):
                await pg.evaluate(f'window.scrollTo(0,{y})'); await pg.wait_for_timeout(60)
            await pg.wait_for_timeout(1200)
            await pg.evaluate('window.scrollTo(0,0)'); await pg.wait_for_timeout(500)
            await pg.screenshot(path=f'shots/{name}-full.png', full_page=True)
            await pg.screenshot(path=f'shots/{name}-first-screen.png')
            ow = await pg.evaluate('document.documentElement.scrollWidth > window.innerWidth')
            print(name, 'height', h, 'overflowX', ow, 'errors', errs)
        await b.close()
asyncio.run(main())
