<div align="center">
    <img src="website/static/favicon.png" alt="Paul Bayfield">
    <h1><a href="https://bayfield.dev">bayfield.dev</a></h1>
</div>


- [Introduction](#introduction-1)
- [Installation](#installation-1)
- [Usage](#usage)
- [License](#license)
- [Credits](#credits-1)


## Introduction

Welcome to the repository of my website [bayfield.dev](https://bayfield.dev)!  
This is a personal website, it allows me to present my projects, my skills and my experiences. In addition, it also serves as a test for projects under development such as [saintthibault.bayfield.dev](https://saintthibault.bayfield.dev).  
The website is developed in Python with the Flask framework, it uses a PostgreSQL database to store user information and sessions.
  
The website can only be launched under a Linux distribution (such as `Ubuntu` or `Raspberry Pi OS`) because some dependencies are not available under Windows (`fcntl` for example).


## Installation

To install the website, you just need to:
- clone the repository,
```sh
git clone https://github.com/PaulBayfield/bayfield.dev.git
```
- install the dependencies,
```sh
pip install -r requirements.txt
```
- configure the server,
```sh
cp .env.example .env
nano .env
```
> **Note**
>
> <div style="background-color:#415971">
> <pre><code>DOMAIN_NAME = bayfield.dev</code><hr><span style="color:#00b300">Domain name of the site, <strong>required for the proper functioning of subdomains</strong> !
> </span></pre>
> </div>
> <div style="background-color:#415971">
> <pre><code>DOWNLOAD_PATH = "/downloads"</code><hr><span style="color:#00b300">Name of the file for the downloads.
> </span></pre>
> </div>
> <div style="background-color:#415971">
> <pre><code>MAX_DURATION = 7200</code><hr><span style="color:#00b300">Maximum duration of a video in seconds (2 hours by default).
> </span></pre>
> </div>
> <div style="background-color:#415971">
> <pre><code>MAX_SAVE = 172800</code><hr><span style="color:#00b300">Maximum duration a video should be saved in seconds (48 hours by default).
> </span></pre>
> </div>
> <div style="background-color:#415971">
> <pre><code>POSTGRES_DATABASE =
> POSTGRES_USER =
> POSTGRES_PASSWORD =
> POSTGRES_HOST =
> POSTGRES_PORT = </code><hr><span style="color:#00b300">Configuration of the PostgreSQL database.
> </span></pre>
> </div>
- launch the website,
```sh
python3 bayfield.dev/launch.py
```
> **Note**
>
> The website will be launched on port `80` by default, if you want to launch it on another port, you just have to modify the file `bayfield.dev/launch.py` and modify the variable `options`, `"bind": "0.0.0.0:PORT"` by specifying your `PORT`.
The website will be executed using the WSGI HTTP server `gunicorn`.


## Usage

The website is composed of several pages:
- [bayfield.dev](https://bayfield.dev) : Home page of the website, it presents my projects, skills and experiences. It serves as a Portfolio.
- [youtube.bayfield.dev](https://youtube.bayfield.dev) : Youtube Downloader, allows you to download Youtube videos.
- [saintthibault.bayfield.dev](https://saintthibault.bayfield.dev) : Website of the Saint-Thibault equestrian center.
And many others...


## License

The project is under the [MIT](https://github.com/PaulBayfield/bayfield.dev/blob/main/LICENSE) license.


## Credits

All libraries used can be found in the [requirements.txt](/requirements.txt) file.

Website entirely made by [Paul Bayfield](https://github.com/PaulBayfield).
