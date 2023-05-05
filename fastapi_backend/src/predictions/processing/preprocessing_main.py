from .preprocessing_utils import get_df, preprocess_body, load_nlp_spacy, tokenize_and_remove_stopwords

def run_preprocessing(body):
    df = get_df(body)
    df['preprocessed_body'] = df['email_body'].apply(preprocess_body)
    nlp = load_nlp_spacy()
    df['tokenized_body'] = df['preprocessed_body'].apply(lambda x: tokenize_and_remove_stopwords(x, nlp))
    return df