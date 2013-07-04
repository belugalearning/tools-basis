#!/bin/bash


targetFile=res.js
echo "" > $targetFile
resources=()

#images first
echo "Compiling Resources"
echo "  Collecting Files"
i=0
for f in `find ./shared-resources -not \( -iname "*@2x.png" -o -iname "*.js" \)`
do
	# remove the starting .
	strippedPath=`echo "$f" | sed "s/\.\//\//g"`
	# clean up the filename
	fileNameClean=`echo "$strippedPath" | sed "s/\/shared\-resources\///g" | sed "s/\/images\///g" | sed "s/\/fonts\///g" | sed "s/\//\_/g" | sed "s/\-/\_/g" | awk '{print tolower($0)}'`
	#remove the extension
	varName=${fileNameClean%.*}

	# if this is not a directory
	if [[ $fileNameClean == *.* ]]
	then
		echo "var $varName = \"$strippedPath\";" >> $targetFile
		resources[$i]="$varName"
		i=$((i+1))
	else
		# append a trailing slash
		echo "var $varName = \"$strippedPath/\";" >> $targetFile
	fi
done

echo "  Writing Resources"
echo "// Cocos Preloaded Resources" >> $targetFile
echo "var g_resources = [" >> $targetFile

# get the last index of the array
last=$(( ${#resources[*]} - 1 ))
for r in "${!resources[@]}"
do
	if [[ $r == $last ]]
	then
		echo "    {src:${resources[$r]}}" >> $targetFile
	else 
		echo "    {src:${resources[$r]}}," >> $targetFile
	fi 
done
echo "];" >> $targetFile

echo "Resources Compiled!"
