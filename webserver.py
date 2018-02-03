from japronto import Application
import os
import aiofiles

async def main(request):
    return request.Response(text='Pong')

async def get_file(request):
    '''Gets a file'''
    async with aiofiles.open('files/' + request.query['fp']) as f:
        return request.Response(text=await f.read())

app = Application()
app.router.add_route('/', main)
app.router.add_route('/file', get_file)
app.run(port=int(os.getenv('PORT')), debug=True)