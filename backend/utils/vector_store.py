try:
    import chromadb
    from langchain_community.embeddings import HuggingFaceEmbeddings
    from langchain_community.vectorstores import Chroma

    client = chromadb.Client()
    embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    def get_vector_store(collection_name: str):
        return Chroma(
            client=client,
            collection_name=collection_name,
            embedding_function=embeddings,
        )
except ImportError:
    def get_vector_store(collection_name: str):
        return None
