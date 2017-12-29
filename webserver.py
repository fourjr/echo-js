from sanic import Sanic
from sanic.response import file
import aiofiles
import aiohttp
import os

app = Sanic(__name__)

@app.listener('before_server_start')
async def start(app, loop):
    app.session = aiohttp.ClientSession(loop=loop)

@app.listener('before_server_stop')
async def stop(app, loop):
    app.session.close()

@app.route('/file/<path:str>')
async def get_file(request, path){
  return file('/' + path)
  #async with aiofiles.open(path, mode='r') as f:
    #return text(await f.read())

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=os.getenv('PORT'))