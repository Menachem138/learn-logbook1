import urllib.parse

github_url = "https://github.com/Menachem138/learn-logbook"
netlify_base = "https://app.netlify.com/start/deploy?repository="
encoded_url = urllib.parse.quote(github_url)
full_url = netlify_base + encoded_url

print(full_url)
