from japronto import Application
import os
import aiohttp 
import aiofiles
import base64

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

// Other useful stuff //

async def b64(request):
    '''Encodes and decodes your given text'''
    mode = request.query.get('mode')
    message = request.query.get('message')
    if mode and message:
        if mode == 'encode':
            return request.Response(json={'response':base64.b64encode(message)}) 
        elif mode == 'decode':
            try:
                return request.Response(json={'response':base64.b64decode(message)}) 
            except:
                return request.Response(json={'response':'Invalid Base64 String to decode'}, status=400)
        else:
             return request.Response(json={'response':'Unknown mode'}, status=400)

app = Application()
app.router.add_route('/', main)
app.router.add_route('/file', get_file)
app.router.add_route('/base64', b64) 
app.run(port=int(os.getenv('PORT')))
