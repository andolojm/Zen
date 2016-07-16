from flask import Flask, render_template

app = Flask(__name__)
app.config.from_object('config')


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/current/')
def get_current():
    data = app.config['CLIENT'].get_current_data()
    return data


if __name__ == '__main__':
    app.run()
