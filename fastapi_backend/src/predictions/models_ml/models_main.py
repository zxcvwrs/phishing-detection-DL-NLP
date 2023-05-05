from .models_utils import get_fasttext_embeddings, get_lstm_predict, get_padded_sequences

def run_model_pipeline(df):
    embeddings = get_fasttext_embeddings(df)
    padded_embeddings = get_padded_sequences(embeddings)
    prediction = get_lstm_predict(padded_embeddings)
    return prediction
