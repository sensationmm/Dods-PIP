import re
from dateutil.parser import parse


def clean(text):
    text = re.sub(r"<[^>]*?>", " ", str(text))
    text = re.sub(r"\s+\s*", " ", str(text))
    text = re.sub(r"^\s+\s*", "", str(text))
    text = re.sub(r"\s+\s*$", "", str(text))
    return text


def date_format(_input):
    _input = re.sub(r'../..', ':', _input)
    dt = parse(_input)
    formatted_time = (dt.strftime('%Y-%m-%dT%H:%M:%S'))
    return formatted_time


def date_format_1(_input):
    _input = re.sub(r'../..', ':', _input)
    dt = parse(_input)
    formatted_time = (dt.strftime('%H:%M:%SZ'))
    return formatted_time


def payload_creation(page_content):
    page_content = re.sub(r'(<div[^>]*?class=\"[^>]*?debate-item[^>]*?>)', r'<block1><block2>\1', page_content)
    page_content = re.sub(r'<p\s*class=\"hs_para\">\s*</p>', '', page_content)

    time_stamp = r'<div[^>]*?class=\"timestamp\"[^>]*?>\s*<time\s*datetime=\"([0-9\/]+)\s+([0-9\:]+)\">'

    title = clean(re.findall(r'<h1[^>]*?>([\w\W]*?)</h1>', page_content, re.IGNORECASE)[0])
    debate_date = clean(re.findall(r'<div[^>]*?col-lg-3\s*date[^>]*?>\s*([\w\W]*?)\s*</div>\s*</div>',
                                   page_content, re.IGNORECASE)[0])
    start_year = clean(re.findall(r'<div[^>]*?class=\"year\"[^>]*?>\s*([^>]*?)\s*</div>',
                                  page_content, re.IGNORECASE)[0])

    volume = ''
    try:
        volume = re.findall(r'<h2[^>]*?heading-level-[\d][^>]*?>\s*(Volume\s*[\d]+)(?::|:\s*debated)',
                            page_content,
                            re.IGNORECASE)
    except Exception as e:
        print(e)
        pass

    time_check_list_1 = re.findall(time_stamp, page_content, re.IGNORECASE)
    item_time = ''
    if time_check_list_1:
        try:
            item_time = time_check_list_1[0][1]
        except Exception as e:
            print(e)
            # there is no previous definition of variable "time" at the original code
            # so I will just skip next line
            # ItemTime = time[-1]
            pass

    source_content = '<h2>'+str(title)+'</h2>'

    if volume:
        source_content = source_content + '<div class="volume">' + str(volume[0]) + "</div>"

    if debate_date:
        source_content = source_content + '<div class="debateDate">' + \
            str(date_format(str(debate_date)+' '+str(item_time)))+"</div>"

    if start_year:
        start_year = parse(start_year).year
        source_content = source_content + '<div class="StartYear">' + str(start_year) + '</div>'
        source_content = source_content + '<div class="EndYear">' + str(start_year + 1) + '</div>'

    block_time, block_column = '', ''
    time = []
    column_number_list = []

    for each_member_block in re.findall(
            r'(<div[^>]*?class=\"[^>]*?debate-item[^>]*?>[\w\W]*?(?:<block1>|</article>))', page_content):

        each_member_block = re.sub(
            r'<a[^>]*?title=\"Share\s*this\s*contribution\"[^>]*?>[\w\W]*?</a>', '', each_member_block,
            flags=re.IGNORECASE)

        member_list = re.findall(
            r'<div[^>]*?class=\"primary-text\"[^>]*?>\s*([\w\W]*?)\s*</div>\s*</div>', each_member_block,
            re.IGNORECASE)
        column_number_regex = r'<span[^>]*?id\=\"([^>]*?)\"[^>]*?class\=\"column\-number'
        time_stamp = r'<div[^>]*?class=\"timestamp\"[^>]*?>\s*<time\s*datetime=\"([0-9\/]+)\s+([0-9\:]+)\">'
        time_and_text = r'<time[^>]*?>\s*([\w\W]*?)\s*<\/time>'
        member_text_para_regex = r'<p[^>]*?>([\w\W]*?)<\/p>'

        column_number = re.findall(
            column_number_regex, each_member_block, re.IGNORECASE)
        time_list = re.findall(time_and_text, each_member_block, re.IGNORECASE)
        time_check_list = re.findall(time_stamp, each_member_block, re.IGNORECASE)

        if time_check_list:
            try:
                block_time = time_check_list[0][1]
            except Exception as e:
                print(e)
                block_time = time[-1]
            time.append(block_time)

        if column_number:
            try:
                block_column = column_number[0]
            except Exception as e:
                print(e)
                block_column = column_number_list[-1] if len(column_number_list) > 0 else ''
            column_number_list.append(block_column)

        if time_list:
            source_content = source_content + '<div class="Time"><p>' + str(clean(time_list[0])) + "</p></div>"
        elif member_list:
            source_content = source_content + '<div class="AnswerText">'
            if block_time:
                source_content = source_content + '<div class="BlockTime">' + str(date_format_1(block_time)) + '</div>'
            if block_column:
                source_content = source_content + '<div class="BlockColumn">' + str(clean(block_column)) + '</div>'

            source_content = source_content + '<h3>' + str(clean(member_list[0])) + '</h3>'

            # Looping to extract the Paragraph values
            for value in re.findall(member_text_para_regex, each_member_block, re.IGNORECASE):
                if str(value) != '':
                    source_content = source_content + \
                        '<p class="hs_Para">' + str(clean(value)) + '</p>'
            source_content = source_content + '</div>'
        else:
            source_content = source_content + '<div class="AnswerText">'
            for value in re.findall(member_text_para_regex, each_member_block, re.IGNORECASE):
                if str(value) != '':
                    source_content = source_content + \
                        '<p class="hs_Para">' + str(clean(value)) + '</p>'
            source_content = source_content + '</div>'

    session_content = ''
    if time:
        session_content = session_content + '<div class="SessionStarttime">' + \
            str(date_format_1(time[0]))+'</div>'
        session_content = session_content + '<div class="SessionEndtime">' + \
            str(date_format_1(time[-1]))+'</div>'

    meta_content = '<meta charset="utf-8"/>'
    html_file = '<html><head>' + meta_content + '</head><body>' + str(session_content) \
                + str(source_content) + '</body></html>'
    return html_file
