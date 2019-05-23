var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('stopwords');
var str = 'Como já fez em disputas anteriores, a revista Veja volta a estampar em sua capa reportagem com reflexos na discussão eleitoral, por envolver figuras direta ou indiretamente envolvidas na busca por votos. Mas com uma novidade desta vez: deixou o costume de lado e disponibilizou todo o conteúdo de sua versão impressa em sua página na internet. Na edição deste fim de semana, em meio a uma das mais acirradas sucessões presidenciais da história do Brasil, a publicação divide as atenções com os próprios protagonistas do pleito, Dilma Rousseff (PT) e Aécio Neves (PSDB).E é a petista quem estampa, neste outubro de 2014, ao lado do ex-presidente Lula, mais uma das polêmicas capas de Veja – levadas a sério por uns, ridicularizadas por outros. Desta vez a denúncia se baseia nos depoimentos do doleiro Alberto Youssef ao Ministério Público e à Polícia Federal, por meio de delação premiada (em troca de redução de pena), sobre o esquema de corrupção bilionário instalado na Petrobras. Segundo a revista, Youssef disse na última terça-feira (21) que Lula e Dilma “sabiam de tudo”, e que a campanha petista pediu R$ 20 milhões aos artífices dos desvios de dinheiro.'
  str = str + ' Na mesma terça-feira, o site do jornal O Globo entrevistou o advogado que lidera a equipe de defesa de Youssef. Ele disse que nem ele nem seus colegas ouviram do cliente, preso desde março, a afirmação bancada pela revista. A matéria afirma que o doleiro não apresentou provas do envolvimento de Dilma e Lula com o esquema. “Youssef simplesmente convenceu os investigadores de que tem condições de obter provas do que afirmou a respeito de a operação não poder ter existido sem o conhecimento de Lula e Dilma – seja pelos valores envolvidos, seja pelo contato constante com Paulo Roberto Costa com ambos, seja pelas operações em favor de aliados”, diz a publicação.'
  str = str + ' O fato é que, desde a noite de quinta-feira (23), data escolhida pela revista para antecipar a notícia, os ânimos de petistas e tucanos, que já andavam exaltados desde antes do primeiro turno, ficaram ainda mais nervosos. Se, de um lado, o caso serve para confirmar o voto em Aécio, de outro reforça a escolha por Dilma. Nas redes sociais, o assunto é um dos mais comentados, com ofensas e gozações de ambas as partes. E acaba por reforçar uma polarização iniciada há cerca de 20 anos, com a disputa entre Lula e Fernando Henrique Cardoso – este, vitorioso por duas vezes no confronto direto.'
  str = str + ' Bem, não cabe ao Congresso em Foco examinar o conteúdo da revista Veja, a mais vendida do país e, reconhecidamente, uma das mais influentes quando se trata de reportagem política. Mas, como se trata de um fato relevante nos estertores de uma campanha marcada pela imprevisibilidade – que o digam os institutos de pesquisa, com suas margens de erro e taxas de confiança –, este site convida o (e)leitor a formar sua opinião. Vale registrar trecho de um breve editorial (Carta ao Leitor) registrado, na versão on-line, antes do início da reportagem.'
  str = str + ' “Cedo ou tarde os depoimentos de Youssef virão a público em seu trajeto na Justiça rumo ao Supremo Tribunal Federal (STF), foro adequado para o julgamento de parlamentares e autoridades citados por ele e contra os quais garantiu às autoridades ter provas. Só então se poderá ter certeza jurídica de que as pessoas acusadas são ou não culpadas”, diz Veja, negando que pretenda interferir no resultado das urnas.'
  


function resume_texto(){
      
      Logger.log(TFIDF(str));
      
}



function TFIDF(documents){
    // calculates TF*IDF
    var TFVals = termFrequency(documents);
    var IDFVals = inverseDocumentFrequency(documents);

    var TFidfDict = {};

    for (var key in TFVals){
        if (key in IDFVals){
            TFidfDict[key] = TFVals[key] * IDFVals[key];
        }
    }


    var max = 0.0;
    var max2 = 0.0;
    var max3 = 0.0;

    var max_sentence = "";
    var max2Sent = "";
    var max3Sent = "";


    // finds the top 3 sentences in TFidfDict
    for (var key in TFidfDict){
        if (TFidfDict[key] > max){
            max = TFidfDict[key];
            max_sentence = key;
        }
        else if (TFidfDict[key] > max2 && TFidfDict[key] < max){
            max2 = TFidfDict[key];
            max2Sent = key;
        }
        else if (TFidfDict[key] > max3 && TFidfDict[key] < max2 && TFidfDict[key] < max){
            max3 = TFidfDict[key];
            max3Sent = key;
        }
    }
    
    const frases = "<br>" + "•" + max_sentence + "<br><br>" + "•" + max2Sent + "<br><br>" + "•" + max3Sent
    return (frases);
}

function termFrequency(document){
    // calculates term frequency of each sentence
    words_without_stopwords = prettify(document);
    
    // gets rid of trailing spaces
    const sentences = document.split(".").map(function(item){return item.trim()});
    //sentences[0] = sentences[0].substring(146);

    const TFVals = countWords(words_without_stopwords)
    const unique_words = uniqueWords(words_without_stopwords);

    // actually makes it TF values according to formula
    for (var key in TFVals){
        TFVals[key] = TFVals[key] / words_without_stopwords.length;
    }

    // splits it up into sentences now
    var TFSentences = {};
    // for every sentence
    for (var i = 0; i <= sentences.length - 1; i ++){
        // for every word in that sentence
        var sentence_split_words = sentences[i].split(" ");
        // get the assiocated TF values of each word
        // temp.add is the "TF" value of a sentence, we need to divide it at the end
        var temp_add = 0.0;
        var words_no_stop_words_length = prettify(sentences[i]).length;
        for (var x = 0; x <= sentence_split_words.length - 1; x++){
            // get the assiocated TF value and add it to temp_add
            if (sentence_split_words[x].toLowerCase() in TFVals){
                // adds all the TF values up
                temp_add = temp_add + TFVals[sentence_split_words[x].toLowerCase()];
            }
            else{
                // nothing, since it's a stop word.
            }
        }
        // TF sentences divide by X number of items on top
        TFSentences[sentences[i]] = temp_add / words_no_stop_words_length;
    }
    
    return TFSentences;
}




function inverseDocumentFrequency(document){


    // calculates the inverse document frequency of every sentence
    const words_without_stopwords = prettify(document);
    const unique_words_set = uniqueWords(words_without_stopwords);

    const sentences = document.split(".").map(function(item){return item.trim()});
    sentences[0] = sentences[0].substring(146);

    const lengthOfDocuments = sentences.length;
    // prettifys each sentence so it doesn't have stopwords

    const wordCountAll = countWords(words_without_stopwords);

    // counts words of each sentence
    // as each sentence is a document
    wordCountSentences = [];
    for (var i = 0; i <= lengthOfDocuments - 1; i ++){
        wordCountSentences.push(countWords(prettify(sentences[i])));
    }

    // calculate TF values of all documents
    var IDFVals = {};

    // how many times that word appears in all sentences (documents)
    wordCountSentencesLength = wordCountSentences.length;
    // for every unique word
    for (var i = 0; i <= unique_words_set.length - 1; i++){
        var temp_add = 0;
        // count how many times unique word appears in all sentences
        for (var x = 0; x <= wordCountSentencesLength - 1; x++){
            if (unique_words_set[i] in wordCountSentences[x]){
                temp_add =+ 1;
            }
        }
        IDFVals[unique_words_set[i]] = Math.log(wordCountAll[unique_words_set[i]] / temp_add)/Math.log(2);
    }
Math.log(x)
    var IDFSentences = {};
    // for every sentence
    for (var i = 0; i <= lengthOfDocuments - 1; i ++){
        // for every word in that sentence
        var sentence_split_words = sentences[i].split(" ");
        // get the assiocated IDF values of each word
        // temp.add is the "IDF" value of a sentence, we need to divide it at the end
        var temp_add = 0.0;
        var words_no_stop_words_length = prettify(sentences[i]).length;
        for (var x = 0; x <= sentence_split_words.length - 1; x++){
            // if the word is not a stopword, get the assiocated IDF value and add it to temp_add
            if (sentence_split_words[x].toLowerCase() in IDFVals){
                // adds all the IDF values up
                temp_add = temp_add + IDFVals[sentence_split_words[x].toLowerCase()];
            }
            else{
                // nothing, since it's a stop word.
            }
        }
        IDFSentences[sentences[i]] = temp_add / words_no_stop_words_length;
    }
    
     Logger.log('========  IDFSentences =====================')
     Logger.log(IDFSentences)
    
    return IDFSentences;
}

//===================================================================================================  


function getStopWords(){
  var val = sheet.getRange(2, 4, sheet.getLastRow(),1).getValues()
  var lista = val.map(function(item){return item[0]})
  return lista
}


function prettify(document){
    // Turns an array of words into lowercase and removes stopwords
    
    const stopwords = getStopWords()
    
    // turn document into lowercase words, remove all stopwords
    var document = document.replace(/[()"“.,–”$]/g, '');
    var document_in_lowercase = document.split(" ").map(function(x){ return x.toLowerCase() });
    Logger.log('STRING')
    Logger.log(document_in_lowercase)
    //return document_in_lowercase.filter( function(x){ return !stopwords.includes(x)});if(array.indexOf("val4")+1) {doSomething;}
    return document_in_lowercase.filter( function(x){ if(stopwords.indexOf(x)<0) {return x}});
}

function countWords(words){
    // returns a dictionary of {WORD: COUNT} where count is
    // how many times that word appears in "words".
    const unique_words = uniqueWords(words);
    var dict = {};
    // for every single unique word
    for (var i = 0; i <= unique_words.length - 1; i++){
        dict[unique_words[i]] = 0
        // see how many times this unique word appears in all words
        for (var x = 0; x <= words.length -1; x++){
            if (unique_words[i] == words[x]){
                dict[unique_words[i]] = dict[unique_words[i]] + 1;
            }
        }
    }
    return dict;
}


function uniqueWords(words){
    
    return unique_words = ArrayLib.unique(words); 
}
