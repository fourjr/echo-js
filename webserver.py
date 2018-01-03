from sanic import Sanic
from sanic.response import text
import aiofiles
import os

app = Sanic(__name__)

@app.route('/')
async def main(request):
    return text('Pong')

@app.route('/file')
async def get_file(request):
    async with aiofiles.open(request.raw_args['fp']) as f:
        return text(await f.read())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('PORT'))