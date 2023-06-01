# Utilities scripts to preprocess corporas/datasets
import mailbox
import os
import re
import cleantext
import pandas as pd
import spacy
import base64
    
from nltk.corpus import stopwords
from bs4 import BeautifulSoup, NavigableString
from functools import wraps
from collections import defaultdict
from pathlib import Path

def retry_args(func):
    @wraps(func)
    def wrapper(first_arg, second_arg, *args, **kwargs):
        try:
            result = func(first_arg, second_arg, *args, **kwargs)
            return result
        except Exception as err:
            print(f"Error: {err}. Retrying with argument.")   
            arg_list = [('iso-8859-1',), ('utf-8',)]
            for arg in arg_list:
                try:
                    result = func(first_arg, second_arg, *arg, *args, **kwargs)
                    return result
                except Exception as err:
                    print(f"Error: {err}. Trying next argument: {arg}.")
            print(f'All attempts failed for: {second_arg}')
            return 'decoding_error'
    return wrapper


@retry_args
def extract_message_body(msg, key, content_charset=''):
    # print(msg)
    for part in msg.walk():
    # this way multipart is decoded at second time (first iteration is header+payload, which results in None)
        if part.is_multipart():
            pass
        elif not part.is_multipart():
            try:   
                if not content_charset:
                    charset_to_decode = part.get_content_charset()
                    if charset_to_decode is None:
                        content_charset = 'utf-8'
                    else:
                        content_charset = charset_to_decode
                try:
                    msg_body = part.get_payload(decode=True).decode(content_charset)
                    if msg_body:
                        # sometimes multipart returns False but payload is empty
                        return msg_body
                except LookupError as lerr:
                    print(lerr)
                    print(f'error at: {key}')
                    raise Exception
            except UnicodeDecodeError as uderr:
                print(uderr)
                print(f'error at: {key}')
                raise Exception
        
def extract_mbox(mbox_files, file_):
    res = defaultdict(list)
    for key in mbox_files.iterkeys():
        try:
            mbox_msg = mbox_files[key]
        except UnicodeDecodeError as uderr:
            print(uderr)
            print(f'Malformed key: {key} at mbox_files: {mbox_files}')
            continue
        msg_body = extract_message_body(mbox_msg, key)
        #msg_header_dict = extract_message_header()
        res['filename'].append(file_)
        res['email_body'].append(msg_body)
        res['file_key'].append(key)
    df = pd.DataFrame(res)
    return df

def mbox_file_to_pd(files_dir, only_file=False):
    if not only_file:
        for file_ in os.listdir(files_dir):
            mbox_files = mailbox.mbox(files_dir + file_)
            print(f"Current file: {file_}")
            df = extract_mbox(mbox_files, file_)
    elif only_file:
        mbox_files = mailbox.mbox(files_dir)
        file_path = Path(files_dir).name
        df = extract_mbox(mbox_files, file_path)
    return df
        

def extract_message_header(mbox_msg, values_to_extract):
    temp_dict = {}
    for value_to_extract in values_to_extract:
        extracted_val = mbox_msg.get(value_to_extract)
        temp_dict[value_to_extract] = extracted_val
    return temp_dict    

def extract_from_html(body):
    try:
        soup = BeautifulSoup(body, 'html.parser')
        for tag in soup.find_all(True):
            if tag.has_attr('href'):
                tag.insert_before(NavigableString(' '))
                tag.replace_with(tag['href'])
            elif tag.has_attr('src'):
                tag.insert_before(NavigableString(' '))
                tag.replace_with(tag['src'])
            elif tag.has_attr('data'):
                tag.insert_before(NavigableString(' '))
                tag.replace_with(tag['data'])
        text = soup.get_text()
        return text
    except Exception as e:
        print(f'Exception occured at: {e} with {body}')
        return "to_manual_extraction"

def tokenize(body, stopwords=stopwords):
    body = body.split(" ")
    body = [token for token in body if not token in stopwords.words('english')]
    return body

def preprocess_body(body):
    body = base64.b64decode(body)
    body = body.lower()
    body = extract_from_html(body)
    if body == 'to_manual_extraction':
        return body
    try:
        body = cleantext.replace_urls(body, replace_with="fixedstringurl")
        body = re.sub(r'\S+@\S+', 'fixedstringemails', body)
        body = re.sub(r"[^a-zA-Z0-9\s]", '', body) 
        body = " ".join(body.split())
    except Exception as e:
        print(f'Exception occured at: {e} with {body}')
        return 'to_manual_extraction'
    return body

def get_df(body):
    data = {}
    data['email_body'] = body
    df = pd.DataFrame(data, index=[0])
    return df


def tokenize(body, nlp):
    doc = nlp(body)
    tokens = [token.text for token in doc if not token.is_stop]
    return tokens


def split_text(text, chunk_size=1000000):
    text_len = len(text)
    chunks = []

    for i in range(0, text_len, chunk_size):
        chunk = text[i:i + chunk_size]
        chunks.append(chunk)

    return chunks

def load_nlp_spacy():
    nlp = spacy.load('en_core_web_sm')
    nlp.disable_pipes(["tagger", "parser", "ner"])
    return nlp

def tokenize_and_remove_stopwords(text, nlp):
    tokens = []
    text_chunks = split_text(text)
    try:
        for doc in nlp.pipe(text_chunks):
            chunk_tokens = [token.text for token in doc if not token.is_stop]
            tokens.extend(chunk_tokens)
    except MemoryError as merr:
        print(merr)
        print(text)
        return 'memoryerror'
    return tokens