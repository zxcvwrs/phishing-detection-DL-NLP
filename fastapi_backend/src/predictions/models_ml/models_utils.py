import gensim
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from config import FASTTEXT_PATH, LSTM_PATH, MAX_TOKENS_LEN


fasttext_model = gensim.models.fasttext.load_facebook_model(FASTTEXT_PATH)
lstm_model = load_model(LSTM_PATH)

def get_fasttext_embeddings(df):
    embedded_sequences = [[fasttext_model.wv[token] for token in seq] for seq in df['tokenized_body']]
    return embedded_sequences

def get_padded_sequences(embedded_sequences, max_tokens_len=MAX_TOKENS_LEN):
    padded_embedded_sequences = pad_sequences(embedded_sequences, maxlen=max_tokens_len, dtype='float32', padding='post', value=0.0)
    return padded_embedded_sequences

def get_lstm_predict(padded_embedded_sequences):
    prediction = lstm_model.predict(padded_embedded_sequences)
    return prediction