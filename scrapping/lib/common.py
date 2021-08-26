from hashlib import md5
import re, os
import logging
from fuzzywuzzy import fuzz
import operator
from configs import Config
from json import loads, dump

class Common:

	def regex(self, pattern, data):
		data = re.findall(pattern, data)
		return data[0] if data else None

	def Originator_Check(self, input):
		try:
			root_dir = os.path.abspath(os.curdir)
			config = Config()._config_read((root_dir + "config.ini"))
			Originator_list = eval(config.get('Originator', 'Originator_list'))
			Scored_Dict={}
			Final_Originator=''
			for Originator in Originator_list:
				score = fuzz.ratio(input, Originator)
				# if int(score) > 50:
				Scored_Dict[Originator]=score
			if Scored_Dict:
				Final_Originator= max(Scored_Dict.items(), key=operator.itemgetter(1))[0]

				input_foratted = re.sub(r'\band\b','&',str(input),re.IGNORECASE)
				if re.findall(input,Final_Originator,re.IGNORECASE):
					pass
				elif re.findall(input_foratted,Final_Originator,re.IGNORECASE):
					pass
				else:
					Final_Originator=input
			else:
				Final_Originator=input

			return 	Final_Originator
		except Exception as e:
			logging.exception(e)
			return input

	def hash(*args):
		args = [str(i) for i in args]
		data = ''.join(args)
		result = md5(data.encode('utf-8'))
		return result.hexdigest()

	def get_file_content(self, path):

		with open(path, 'r') as file:
			schema = loads(file.read())
		return schema
