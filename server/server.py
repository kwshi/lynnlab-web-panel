import aiohttp.web as web
import asyncio


async def handle(request):
    return web.Response(text='hi there')

app = web.Application()
app.add_routes([web.get('/', handle)])

runner = web.AppRunner(app)

loop = asyncio.get_event_loop()
loop.run_until_complete(runner.setup())

site = web.TCPSite(runner, 'localhost', 8080)

loop.run_until_complete(site.start())
loop.run_forever()
loop.run_until_complete(runner.cleanup())
