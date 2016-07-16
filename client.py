# Clash of Clans API consumer

import requests


class Client:
    def __init__(self, key, id):
        self.clan_id = id
        self.api_key = key

    def get_current_data(self):
        url = 'https://api.clashofclans.com/v1/clans/%s/members?limit=50' % self.clan_id
        auth_token = 'Bearer %s' % self.api_key
        headers = {
            'Authorization': auth_token,
            'Accept': 'application/json'
        }
        return requests.get(url, headers=headers).text
