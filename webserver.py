from japronto import Application
import os
import aiohttp 
import aiofiles

async def main(request):
    return request.Response(text='Pong')

async def get_file(request):
    '''Gets a file'''
    try:
        fp = 'files/' + request.query['fp']
        async with aiofiles.open(fp) as f:
            return request.Response(text=await f.read())
    except (FileNotFoundError, NotADirectoryError):
        return request.Response(text=f'No such file found: {fp}', code=404)

app = Application()
app.router.add_route('/', main)
app.router.add_route('/file', get_file)
app.run(port=int(os.getenv('PORT')))
