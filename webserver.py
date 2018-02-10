from japronto import Application
import os
import aiohttp 
import aiofiles
import base64 

async def main(request):
    return request.Response(text='Pong')

async def get_file(request):
    '''Gets a file'''
    if app.session is None:
        app.session = aiohttp.ClientSession(loop=app.loop)
    try:
        fp = 'files/' + request.query['fp']
        async with aiofiles.open(fp) as f:
            return request.Response(text=await f.read())
    except (FileNotFoundError, NotADirectoryError):
        return request.Response(text=f'No such file found: {fp}', code=404)

async def hastebin(request):
    '''POSTs to the Hastebin API'''
    if app.session is None:
        app.session = aiohttp.ClientSession(loop=app.loop)
    async with app.session.post('https://www.hastebin.com/documents', data=base64.b64decode(request.query['data']).decode('utf-8'))as resp:
        return request.Response(json=await resp.json())

app = Application()
app.session = None
app.router.add_route('/', main)
app.router.add_route('/hastebin', hastebin) 
app.router.add_route('/file', get_file)
app.run(port=int(os.getenv('PORT')))
