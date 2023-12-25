from quart import render_template, url_for, send_file, session, request

from ...components.blueprints import Bp
from ...components.respond import Respond

from ...utils.db import getUser


import asyncio

from io import BytesIO
from PyPDF2 import PdfMerger


def init(app):
    blueprint = Bp(
        name='pdf',
        import_name=__name__,
        template_folder='templates',
        static_folder='static',
        static_url_path='/static/pdf/'
    )


    """
    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
    ┃                                                                                                                      ┃
    ┃                                                - PDF merger Routes -                                                 ┃
    ┃                                                                                                                      ┃
    ┃                                                                                                                      ┃
    ┃  • pdf.bayfield.dev                                                                                                  ┃
    ┃    > Home page of the PDF merger.                                                                                    ┃
    ┃  • pdf.bayfield.dev/internal/merge                                                                                   ┃
    ┃    > (Backend) Merge the PDF files.                                                                                  ┃
    ┃  • pdf.bayfield.dev/login                                                                                            ┃
    ┃    > Login page of the PDF page.                                                                                     ┃
    ┃  • pdf.bayfield.dev/logout                                                                                           ┃
    ┃    > Logout page of the PDF page.                                                                                    ┃
    ┃                                                                                                                      ┃
    ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
    """

    @blueprint.path(app, uri='/', method=['GET','POST'], subdomain="pdf", log_file="logging/website.log")
    async def home():
        """
        Home page of the PDF merger.
        
        :return: The rendered template.
        """
        if not session.get("username"):
            return Respond.redirect(url_for('pdf.login'))

        return Respond.html(await render_template('upload.html'))
    

    @blueprint.path(app, uri='/internal/merge', method=['POST'], subdomain="pdf", log_file="logging/website.log")
    async def internal_merge():
        """
        Merge the PDF files.
        
        :return: The file.
        """
        if not session.get("username"):
            return Respond.redirect(url_for('pdf.login'))

        files = await request.files

        # Check if the 'uploaded_file' key is in the request files
        if 'uploaded_file' not in files:
            return Respond.json({'error': 'No file part'})

        uploaded_files = files.getlist('uploaded_file')
    
        merged_file_bytes_io = await merge_files(uploaded_files)

        return await send_file(merged_file_bytes_io, mimetype='application/pdf', as_attachment=True)
        

    async def merge_files(uploaded_files):
        loop = asyncio.get_event_loop()

        for uploaded_file in uploaded_files:
            if not allowed_file(uploaded_file.filename):
                raise ValueError('Please upload only PDF files.')

        def merge_pdfs():
            merger = PdfMerger()

            for uploaded_file in uploaded_files:
                uploaded_file_bytes = uploaded_file.read()
                uploaded_pdf = BytesIO(uploaded_file_bytes)
                merger.append(uploaded_pdf)

            # Save the merged PDF to a BytesIO object
            merged_pdf_bytes_io = BytesIO()
            merger.write(merged_pdf_bytes_io)
            merger.close()

            return merged_pdf_bytes_io.getvalue()

        # Run the synchronous merge_pdfs function in a separate thread
        merged_pdf_bytes = await loop.run_in_executor(None, merge_pdfs)

        return BytesIO(merged_pdf_bytes)


    def allowed_file(filename):
        return '.' in filename and filename.rsplit('.', 1)[1].lower() in {"pdf"}


    @blueprint.path(app, uri='/login', method=['GET','POST'], subdomain="pdf", log_file="logging/website.log")
    async def login():
        """
        Login page of the PDF page.
        
        :return: The rendered template.
        """
        if session.get("username"):
            return Respond.redirect(url_for('pdf.home'))

        error = None
        if request.method == 'POST':
            form_data = await request.form

            if form_data.get('username', None) and form_data.get('password', None):
                username = form_data.get('username')
                password = form_data.get('password')

                data = await getUser(app.pool, username, password)

                if not data:
                    error = "Invalid credentials. Please try again."

                    return Respond.html(await render_template('login.html', error=error))
                else:
                    session['username'] = username
                    session['admin'] = data["admin"]

                    return Respond.redirect(url_for('pdf.home'))
            else:
                return Respond.redirect(url_for('pdf.login'))
        else:
            return Respond.html(await render_template('login.html', error=error))
    
    
    @blueprint.path(app, uri='/logout', method=['GET','POST'], subdomain="pdf", log_file="logging/website.log")
    async def logout():
        """
        Logout page of the PDF page.
        
        :return: The rendered template.
        """
        if session.get("username"):
            session.clear()

        return Respond.redirect(url_for('pdf.login'))


    return blueprint
