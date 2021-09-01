from hashlib import md5
import re
import os
import logging
from fuzzywuzzy import fuzz
import operator
from configs import Config
from json import loads
from bs4 import BeautifulSoup

class Common:

	@staticmethod
	def regex(pattern, data):
		data = re.findall(pattern, data)
		return data[0] if data else None

	@staticmethod
	def originator_check(input_):
		try:
			root_dir = os.path.abspath(os.curdir)
			config = Config().config_read(root_dir + "config.ini")
			originator_list = eval(config.get('Originator', 'Originator_list'))
			scored_dict = {}
			# Final_Originator = ''
			for Originator in originator_list:
				score = fuzz.ratio(input_, Originator)
				# if int(score) > 50:
				scored_dict[Originator] = score
			if scored_dict:
				final_originator = max(scored_dict.items(), key=operator.itemgetter(1))[0]

				input_formatted = re.sub(r'\band\b', '&', str(input_), re.IGNORECASE)
				if re.findall(input_, final_originator, re.IGNORECASE):
					pass
				elif re.findall(input_formatted, final_originator, re.IGNORECASE):
					pass
				else:
					final_originator = input_
			else:
				final_originator = input_

			return final_originator
		except Exception as e:
			logging.exception(e)
			return input_

	def hash(*args):
		args = [str(i) for i in args]
		data = ''.join(args)
		result = md5(data.encode('utf-8'))
		return result.hexdigest()

	@staticmethod
	def get_file_content(path):
		with open(path, 'r') as file:
			schema = loads(file.read())
		return schema

	@staticmethod
	def convert_2_xhtml(html):
		soup = BeautifulSoup(html, "html5lib")
		[x.extract() for x in soup.find_all() if len(x.text) == 0]
		[x.extract() for x in soup.find_all('script')]
		[x.extract() for x in soup.find_all('style')]
		[x.extract() for x in soup.find_all('noscript')]
		[x.extract() for x in soup.find_all(r'\s*')]
		soup.prettify()
		return soup
