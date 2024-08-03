from quart import send_file, render_template, url_for, request

from ...components.blueprints import Bp
from ...components.respond import Respond
from ...components.auth import Auth


import os

from datetime import datetime


def init(app):
    blueprint = Bp(
        name='media',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static/media/'
    )


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                                  - Media Routes -                                                    ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • media.bayfield.dev/<path:filename>                                                                                ┃
    ┃    > Shared public medias                                                                                            ┃
    ┃  • media.bayfield.dev/<dir>/<path:filename>                                                                          ┃
    ┃    > Shared medias                                                                                                   ┃
    ┃  • upload.bayfield.dev                                                                                               ┃
    ┃    > Upload medias                                                                                                   ┃
    ┃  • upload.bayfield.dev/upload                                                                                        ┃
    ┃    > (Backend) Upload medias                                                                                         ┃
    ┃  • upload.bayfield.dev/delete/<dir>/<path:filename>                                                                  ┃
    ┃    > (Backend) Delete a media                                                                                        ┃
    ┃  • upload.bayfield.dev/download/<dir>/<path:filename>                                                                ┃
    ┃    > (Backend) Download a media                                                                                      ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """


    @blueprint.path(app, uri='/<path:filename>', method=['GET'], subdomain="media", log_file="logging/website.log")
    async def media(filename: str):
        """
        A media file.

        :param filename: The name of the file.
        :return: The file.
        """
        if not os.path.exists(f"{app.path}/media/public/{filename.lower()}"):
            return Respond.render(
                await render_template('404.html')
            )
        else:
            return await send_file(f"{app.path}/media/public/{filename.lower()}")
        

    @blueprint.path(app, uri='/<dir>/<path:filename>', method=['GET', 'POST'], subdomain="media", log_file="logging/website.log")
    async def mediaWithDir(dir: str, filename: str):
        """
        A media file.

        :param filename: The name of the file.
        :param dir: The directory of the file.
        :return: The file.
        """
        if request.method == "POST":
            if dir != "private":
                return Respond.render(
                    await render_template('error.html', message="Invalid path!")
                )
            else:
                form = await request.form
                password = form.get("password", "")

                if password == "":
                    return Respond.render(
                        await render_template('error.html', message="No password?")
                    )

                for repository in os.listdir(f"{app.path}/media/private"):
                    for file in os.listdir(f"{app.path}/media/private/{repository}"):
                        if password == repository and file == filename.lower():
                            return await send_file(f"{app.path}/media/private/{repository}/{file}")
                        
                return Respond.render(
                    await render_template('error.html', message="Invalid password!")
                )
        else:
            if dir not in ["public", "temporary", "private", "archive"]:
                dir = f"custom/{dir}"

            if dir == "private":
                exists = False
                for repository in os.listdir(f"{app.path}/media/private"):
                    if filename.lower() in os.listdir(f"{app.path}/media/private/{repository}"):
                        exists = True

                if not exists:
                    return Respond.render(
                        await render_template('404.html')
                    )
                else:
                    return Respond.render(
                        await render_template('password.html', file=filename.lower(), path=dir)
                    )
            elif dir == "public":
                return Respond.redirect(url_for('media.media', filename=filename))
            else:
                if not os.path.exists(f"{app.path}/media/{dir}/{filename.lower()}"):
                    return Respond.render(
                        await render_template('404.html')
                    )
                else:
                    return await send_file(f"{app.path}/media/{dir}/{filename.lower()}")


    @blueprint.path(app, uri='/', method=['GET', 'POST'], subdomain="upload", log_file="logging/website.log", auth=Auth.ADMIN)
    async def upload():
        """
        The upload page.

        :return: The upload page.
        """
        formPath = request.args.get("path", "public")

        if formPath not in ["public", "temporary", "private", "archive", "custom"]:
            return Respond.render(
                await render_template('error.html', message="Invalid path!")
            )
        else:
            formPath = f"{formPath}/"

        files = []
        if formPath not in ["private/", "custom/"]:
            path = f"{app.path}/media/{formPath}"
            for file in os.listdir(path):
                if os.path.isfile(os.path.join(path, file)):
                    files.append({
                        "name": file,
                        "size": os.path.getsize(f"{app.path}/media/{formPath}{file.lower()}"),
                        "date": os.path.getmtime(f"{app.path}/media/{formPath}{file.lower()}"),
                        "path": formPath[:-1]
                    })
        else:
            for repository in os.listdir(f"{app.path}/media/{formPath}"):
                for file in os.listdir(f"{app.path}/media/{formPath}{repository}"):
                    if os.path.isfile(os.path.join(f"{app.path}/media/{formPath}{repository}", file)):
                        files.append({
                            "name": file,
                            "size": os.path.getsize(f"{app.path}/media/{formPath}{repository}/{file.lower()}"),
                            "date": os.path.getmtime(f"{app.path}/media/{formPath}{repository}/{file.lower()}"),
                            "path": formPath[:-1] if formPath == "private/" else repository,
                            "message": repository
                        })

        return Respond.render(
            await render_template('upload.html', files=sorted(files, key=lambda x: x['date'], reverse=True)[:15], path=formPath[:-1])
        )


    @blueprint.path(app, uri='/upload', method=['POST'], subdomain="upload", log_file="logging/website.log", auth=Auth.ADMIN)
    async def send():
        """
        The upload files background page.
        
        :return: The uploaded files page.
        """
        data = await request.files
        files = data.getlist("file")

        form = await request.form
        formPath = form.get("path", "")
        formPassword = form.get("password", "")
        formCustom = form.get("custom", "")
        formFilename = form.get("filename", "")

        if len(files) == 0:
            return Respond.render(
                await render_template('error.html', message="No files!")
            )
        elif len(files) == 1 and formFilename != "":
            files[0].filename = formFilename

        if formPath not in ["public", "temporary", "private", "archive", "custom"]:
            return Respond.render(
                await render_template('error.html', message="Invalid path!")
            )
        else:
            if formPath == "custom":
                if "/" in formCustom:
                    return Respond.render(
                        await render_template('error.html', message="Invalid custom path!")
                    )

                formPath = f"custom/{formCustom}"
                saveDir = f"{formCustom}/"

                if not formPath.endswith("/"):
                    formPath = f"{formPath}/"
                if formPath.startswith("/"):
                    formPath = formPath[1:]

                if not os.path.exists(f"{app.path}/media/{formPath}"):
                    os.makedirs(f"{app.path}/media/{formPath}")
            elif formPath == "private":
                if formPassword == "":
                    return Respond.render(
                        await render_template('error.html', message="Invalid password!")
                    )
                elif len(files) > 1:
                    return Respond.render(
                        await render_template('error.html', message="Only one file allowed!")
                    )
                else:
                    exists = False
                    filename = files[0].filename.lower()
                    for repository in os.listdir(f"{app.path}/media/private"):
                        if filename in os.listdir(f"{app.path}/media/private/{repository}"):
                            exists = True
                            break

                if exists:
                    return Respond.render(
                        await render_template('error.html', message="File already exists!")
                    )
                else:
                    if not os.path.exists(f"{app.path}/media/private/{formPassword}"):
                        os.makedirs(f"{app.path}/media/private/{formPassword}")

                formPath = f"private/{formPassword}"

                if not formPath.endswith("/"):
                    formPath = f"{formPath}/"
                if formPath.startswith("/"):
                    formPath = formPath[1:]

                saveDir = "private/"
            else:
                formPath = f"{formPath}/"
                saveDir = formPath

        if formPath == "/private" and formPassword == "":
            return Respond.render(
                await render_template('error.html', message="Invalid password!")
            )

        saved = []
        for file in files:
            filename: str = file.filename

            if os.path.exists(f"{app.path}/media/{formPath}{filename.lower()}"):
                saved.append({
                    "name": filename,
                    "size": os.path.getsize(f"{app.path}/media/{formPath}{filename.lower()}"),
                    "error": "File already exists!",
                    "date": os.path.getmtime(f"{app.path}/media/{formPath}{filename.lower()}"),
                    "path": "" if saveDir in ["public/", "custom/"] else saveDir[:-1]
                })
            else:
                await file.save(f"{app.path}/media/{formPath}{filename.lower()}")
                saved.append({
                    "name": filename,
                    "size": os.path.getsize(f"{app.path}/media/{formPath}{filename.lower()}"),
                    "date": os.path.getmtime(f"{app.path}/media/{formPath}{filename.lower()}"),
                    "message": "File uploaded!",
                    "path": "" if saveDir in ["public/", "custom/"] else saveDir[:-1]
                })

        return Respond.render(
            await render_template('uploaded.html', files=saved, actions=False, path=formPath.split('/')[0])
        )


    @blueprint.path(app, uri='/delete/<dir>/<path:filename>', method=['GET', 'POST'], subdomain="upload", log_file="logging/website.log", auth=Auth.ADMIN)
    async def delete(dir: str, filename: str):
        """
        The delete page.

        :param filename: The name of the file.
        :return: The delete page.
        """
        if dir not in ["public", "temporary", "private", "archive", "custom"]:
            dir = f"custom/{dir}"

        if dir == "private":
            for repository in os.listdir(f"{app.path}/media/private"):
                if filename in os.listdir(f"{app.path}/media/private/{repository}"):
                    dir = f"private/{repository}"

        if os.path.exists(f"{app.path}/media/{dir}/{filename.lower()}"):
            os.remove(f"{app.path}/media/{dir}/{filename.lower()}")

            if dir.startswith("private"):
                if len(os.listdir(f"{app.path}/media/private/{dir.split('/')[1]}")) == 0:
                    os.rmdir(f"{app.path}/media/private/{dir.split('/')[1]}")
            elif dir.startswith("custom"):
                if len(os.listdir(f"{app.path}/media/custom/{dir.split('/')[1]}")) == 0:
                    os.rmdir(f"{app.path}/media/custom/{dir.split('/')[1]}")

            return Respond.redirect(url_for('media.upload'))
        else:
            return Respond.render(
                await render_template('404.html')
            )
        

    @blueprint.path(app, uri='/download/<dir>/<path:filename>', method=['GET'], subdomain="upload", log_file="logging/website.log", auth=Auth.ADMIN)
    async def download(dir: str, filename: str):
        """
        The download page.

        :param filename: The name of the file.
        :return: The file.
        """
        if dir not in ["public", "temporary", "private", "archive", "custom"]:
            dir = f"custom/{dir}"

        if dir == "private":
            for repository in os.listdir(f"{app.path}/media/private"):
                if filename in os.listdir(f"{app.path}/media/private/{repository}"):
                    dir = f"private/{repository}"

        if os.path.exists(f"{app.path}/media/{dir}/{filename.lower()}"):
            return await send_file(f"{app.path}/media/{dir}/{filename.lower()}", as_attachment=True)
        else:
            return Respond.render(
                await render_template('404.html')
            )


    @blueprint.app_template_filter("fileSize")
    def fileSize(size: str) -> str:
        # Convert size to human readable format
        for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
            if size < 1024:
                return f"{size:.2f} {unit}"
            size /= 1024
        return f"{size:.2f} PB"


    @blueprint.app_template_filter("fileDate")
    def fileDate(date: str) -> str:
        # Convert date to human readable format
        return datetime.fromtimestamp(date).strftime("%d/%m/%Y à %H:%M:%S")


    return blueprint
