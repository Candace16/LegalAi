import os
from backend.utils.vector_store import get_vector_store
from backend.utils.mock_llm import get_mock_qa_answer

try:
    from langchain_groq import ChatGroq
    from langchain_core.prompts import PromptTemplate
    from langchain.text_splitter import RecursiveCharacterTextSplitter
    from langchain.chains import RetrievalQA
except ImportError:
    pass

class QAAgent:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        if self.api_key:
            self.llm = ChatGroq(temperature=0, model_name="llama-3.1-8b-instant", groq_api_key=self.api_key)
        else:
            self.llm = None

    def index_document(self, doc_id: int, text: str):
        """
        Splits the text into chunks and stores in ChromaDB collection specific to the document.
        """
        try:
            vector_store = get_vector_store(f"doc_{doc_id}")
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
            chunks = text_splitter.split_text(text)
            # Create metadata to track source
            metadatas = [{"source": f"doc_{doc_id}", "chunk": i} for i in range(len(chunks))]
            vector_store.add_texts(texts=chunks, metadatas=metadatas)
            return True
        except Exception as e:
            print(f"Error indexing document: {e}")
            return False

    def ask_question(self, doc_id: int, question: str):
        if not self.llm:
            ans, cit = get_mock_qa_answer(question)
            return {"answer": ans, "citation": cit}

        try:
            vector_store = get_vector_store(f"doc_{doc_id}")
            retriever = vector_store.as_retriever(search_kwargs={"k": 2})
            
            prompt = PromptTemplate.from_template(
                """
                You are a legal assistant. Answer the user's question ONLY based on the provided document context.
                If the answer is not in the document context, say "This information is not in the document."
                
                Context:
                {context}
                
                Question: {question}
                """
            )
            
            chain = RetrievalQA.from_chain_type(
                llm=self.llm,
                chain_type="stuff",
                retriever=retriever,
                return_source_documents=True,
                chain_type_kwargs={"prompt": prompt}
            )
            
            response = chain.invoke({"query": question})
            answer = response['result']
            
            # Extract citation from the top source document
            citation = None
            if response.get('source_documents') and len(response['source_documents']) > 0:
                # Provide a snippet of the exact text it came from
                top_doc = response['source_documents'][0]
                citation = top_doc.page_content[:200] + "..."
                
            return {
                "answer": answer,
                "citation": citation
            }
        except Exception as e:
            print(f"QA Error: {e}")
            ans, cit = get_mock_qa_answer(question)
            return {"answer": ans, "citation": cit}
